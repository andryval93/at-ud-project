import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utente } from '../../entity/utente';
import { Storage } from '@ionic/storage';
import { UserProfilePage } from '../user-profile/user-profile';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the SpeechPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(private viewCtrl: ViewController, public http: Http, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  start() {
    
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