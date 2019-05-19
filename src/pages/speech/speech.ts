import 'rxjs/add/operator/map';

import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Utente } from '../../entity/utente';
import { UserProfilePage } from '../user-profile/user-profile';
import { checkAndUpdateTextDynamic } from '@angular/core/src/view/text';

//@ts-ignore
//@ts-nocheck
//var AWS = require("aws-sdk");

/**
 * Generated class for the SpeechPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var AWS;
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:cbadba96-0039-4bb8-8d3f-0da6066c0612',
});
// Make the call to obtain credentials
AWS.config.credentials.get(function () {
  // Credentials will be available when this function is called.
  var accessKeyId = AWS.config.credentials.accessKeyId;
  var secretAccessKey = AWS.config.credentials.secretAccessKey;
  var sessionToken = AWS.config.credentials.sessionToken;
});
var comprehend = new AWS.Comprehend({ apiVersion: '2017-11-27' });

@IonicPage()
@Component({
  selector: 'page-speech',
  templateUrl: 'speech.html',
})
export class SpeechPage {

  usr: Utente;
  listenedText: string;
  keyWords: Array<string> = new Array<string>();
  values: string;
  keyWordsLink: Array<string> = new Array<string>();
  termToSpeech: string;

  translatedText: string = '';

  constructor(private viewCtrl: ViewController, public http: Http, public storage: Storage,
    public navCtrl: NavController, public navParams: NavParams, /*private speechRecognition: SpeechRecognition*/) {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ngOnInit() {

    /*
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {

        if (!hasPermission) {
        this.speechRecognition.requestPermission()
          .then(
            () => console.log('Granted'),
            () => console.log('Denied')
          )
        }

     });
     */

  }

  translate() {
    // console.log("AWS test", AWS);
    /*var params = {
      LanguageCode: 'it',
      TextList: [    
        'Andrea beve il caffè',
      ]
    };
    comprehend.batchDetectEntities(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });*/
    
    var params = {
      LanguageCode: "it",
      Text: 'Andrea beve il caffè'
    };
    comprehend.detectSyntax(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else { 
        console.log("successful response", data); // successful response
        // DA VEDERE
        translatedText = data['SyntaxTokens'][0]['Text'];
        console.log("ROBERTO'S OUTPUT: ", data['SyntaxTokens'][0]['Text']);
      }
    });
    
  }

  updateText() {
    this.translatedText = 'Roberto';
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  start() {
    /*
    this.speechRecognition.startListening()
          .subscribe(
            (matches: Array<string>) => {
              this.listenedText = matches[0];
            },
            (onerror) => console.log('error:', onerror)
          )
          */
  }

  talk() {
    
  }

  operUserProfile() {
    this.navCtrl.push(UserProfilePage, {
      usr: this.usr,
      utenteLoggato: this.usr
    })
  }

  keywordText(text) {
    text.split(" ").forEach(elem => {
      var link = 'http://api.giphy.com/v1/gifs/search?q=american+sign+language+with+robert+' + elem + '&api_key=WYBOoj4gFUUsUQjUCB1gUr5Er7WqbckE&limit=1';
      //var link = 'https://giphy.com/search/@signwithrobert-friday&api_key=WYBOoj4gFUUsUQjUCB1gUr5Er7WqbckE'
      //alert(link)
      this.http.get(link).map(res => res.json()).subscribe(data => {
        this.values = data.data.images.downsized_medium.url;
        this.keyWordsLink.push(this.values);
        console.log(data.data)
      });
    })
  }

}
