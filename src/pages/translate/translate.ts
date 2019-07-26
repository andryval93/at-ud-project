import 'rxjs/add/operator/map';

import { Component } from '@angular/core';
import { Http } from '@angular/http';
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
  selector: 'page-translate',
  templateUrl: 'translate.html',
})
export class TranslatePage {

  usr: Utente;
  outputs = [];
  // gifs = [];
  gifDictionary = ['abbracciare', 'acqua', 'amare', 'amato', 'contratto', 'avere paura', 'avere',
  'ballare', 'bambino', 'bere', 'camminare', 'cane', 'cibo', 'contratto', 'cura', 'domanda', 
  'dovere', 'essere', 'fatto', 'fidanzata', 'fidanzato', 'fratello', 'gatto', 'giocare', 'guidare',
  'io', 'lei', 'loro', 'lui', 'madre', 'mangiare', 'mare', 'mela', 'motorino', 'non', 'noi', 
  'nuotare', 'palla', 'parlare', 'pesce', 'potere', 'scrivere', 'te', 'torta', 'volere'];
  insertedText: string;
  analyzedText: string;
  fraseTradotta: Array<string>;

  constructor(private viewCtrl: ViewController, public http: Http, public storage: Storage,
    public navCtrl: NavController, public navParams: NavParams, /*private speechRecognition: SpeechRecognition*/) {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ngOnInit() {

  }

  translate() {
    var params = {
      LanguageCode: "it",
      Text: this.insertedText
    };
    comprehend.detectSyntax(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else { 
        console.log("successful response", data); // successful response
        this.parseResponse(data);
        // this.analyzeText(data);
      }
    });
  }

  parseResponse(data) {
    // this.gifs = [];
    this.outputs = [];
    var modali = this.findModali(data);
    var aggettivo = this.findAggettivi(data);
    var verbo = this.findVerbo(data);
    var ausiliare = this.findAux(data);
    var avverbio = this.findAvverbio(data);
    var isNegative = this.findNegazione(data);
    this.fraseTradotta = [""];
    data.SyntaxTokens.forEach(element => {
      if(element.PartOfSpeech.Tag == "PROPN") {
          this.fraseTradotta.push(element.Text.toUpperCase());
      }
      if(element.PartOfSpeech.Tag == "NOUN") {
        this.fraseTradotta.push(element.Text.toUpperCase());
      }
      if(element.PartOfSpeech.Tag == "PRON") {
        this.fraseTradotta.push(element.Text.toUpperCase());
      }
    })
    if (verbo.find) {
      this.fraseTradotta.push(verbo.verbo);
    } else if (ausiliare.find) {
      this.fraseTradotta.push(ausiliare.aux);
    }
    if (modali.find) {
      this.fraseTradotta.push(modali.modale);
    }
    if (avverbio.find) {
      this.fraseTradotta.push(avverbio.avverbio);
    }
    if (isNegative.find) {
      this.fraseTradotta.push(isNegative.negazione);
    } else if (ausiliare.find && verbo.find) {
        this.fraseTradotta.push('FATTO');
    }

    console.log('verbo', verbo);
    // console.log('aggettivo', aggettivo);
    console.log('modali', modali);
    console.log('isNegative', isNegative);
    console.log('fraseTradotta', this.fraseTradotta)
    
    type output = [string, any[]];
    this.fraseTradotta.forEach(element => {
      if (element != "" && element != " ") {
        var op: output;
        var gifArray = [];
        // gifArray = [''];
        if (this.gifDictionary.indexOf(element.toLowerCase()) > -1) {
          // this.gifs.push(element);
          // this.gifs.push('../../assets/parole/' + element + '.gif');
          // this.gifs.push('../../assets/separatore.png');
          op = [element, ['../../assets/parole/' + element + '.gif']];
          this.outputs.push(op);
          console.log("Parola trovata: " + element);
        } else {
          console.log('Parola non trovata: ' + element);
          // this.gifs.push(element);
          // this.gifs.push('../../assets/alfabeto/' + element.charAt(0).toUpperCase() + '.gif');
          // gifArray[0] = '../../assets/alfabeto/' + element.charAt(0).toUpperCase() + '.gif';
          for (var i = 0; i < element.length; i++) {
            // this.gifs.push('../../assets/alfabeto/' + element.charAt(i).toUpperCase() + '.gif');
            gifArray.push('../../assets/alfabeto/' + element.charAt(i).toUpperCase() + '.gif');
          }
          if (gifArray != null) {
            op = [element, gifArray];
          } else {
            op = [element, ['']];
          }
          // this.gifs.push('../../assets/separatore.png');
          this.outputs.push(op);
        }
      }
    });
  }

  findVerboInfinito(verbo): string {
    let ausiliare = this.checkEssereAvere(verbo);
    if (ausiliare != '') {
      return ausiliare;
    }
    for (var i = 0; i < verbo.length - 1; i++) {
      var wordToSearch = verbo.substring(0, verbo.length - i);
      for (let gifWord of this.gifDictionary) {
        if (gifWord.indexOf(wordToSearch.toLowerCase()) == 0) {
          var gifSuffix = gifWord.substring(gifWord.length - 3, gifWord.length);
          if (gifSuffix === 'are' || gifSuffix === 'ere' || gifSuffix === 'ire') {
            return gifWord.toUpperCase();
          }
        }
      }
    }
    return verbo;
  }

  findAggettivi(data) {
    let toReturn = {find: false, aggettivo: ''}
    data.SyntaxTokens.forEach(element => {
      if(element.PartOfSpeech.Tag == "ADJ") {
        console.log('Aggettivo', element.PartOfSpeech.Tag);
        toReturn.find = true;
        toReturn.aggettivo = element.Text.toUpperCase();
      }
      if(element.PartOfSpeech.Tag == "DET") {
        switch (element.Text.toLowerCase()) {
          case 'tutto':
          case 'tutta':
          case 'tutti':
          case 'tutte':
            console.log('Determinante', element.PartOfSpeech.Tag);
            toReturn.find = true;
            toReturn.aggettivo = element.Text.toUpperCase();
            break;
        }
      }
    });
    return toReturn;
  }

  findModali(data) {
    let toReturn = {find: false, modale: ''}
    data.SyntaxTokens.forEach(element => {
      if(element.PartOfSpeech.Tag == "AUX") {
        switch (element.Text.toLowerCase()) {
          case 'posso':
          case 'puoi':
          case 'può':
          case 'possiamo':
          case 'potete':
          case 'possono':
            toReturn.find = true;
            toReturn.modale = 'POTERE';
            break;
          case 'devo':
          case 'devi':
          case 'deve':
          case 'dobbiamo':
          case 'dovete':
          case 'devono':
            toReturn.find = true;
            toReturn.modale = 'DOVERE';
            break;
          case 'voglio':
          case 'vuoi':
          case 'vuole':
          case 'vogliamo':
          case 'volete':
          case 'vogliono':
            toReturn.find = true;
            toReturn.modale = 'VOLERE';
            break;
        }
      }
    });
    return toReturn;
  }

  findVerbo (data) {
    let toReturn = {find: false, verbo: ''}
    data.SyntaxTokens.forEach(element => {
      if(element.PartOfSpeech.Tag == "VERB") {
        toReturn.find = true;
        toReturn.verbo = this.findVerboInfinito(element.Text.toUpperCase());
      }
    });
    return toReturn;
  }

  findAux(data) {
    let toReturn = {find: false, aux: ''}
    data.SyntaxTokens.forEach(element => {
      if(element.PartOfSpeech.Tag == "AUX") {
        console.log('Aux', element.Text);
        let ausiliare = this.checkEssereAvere(element.Text);
        if (ausiliare != '') {
          toReturn.find = true;
          toReturn.aux = ausiliare;
        }
      }
    });
    return toReturn;
  }

  findAvverbio(data) {
    let toReturn = {find: false, avverbio: ''}
    data.SyntaxTokens.forEach(element => {
      if(element.PartOfSpeech.Tag == "ADV") {
        switch (element.Text.toLowerCase()) {
          case 'no':
          case 'non':
          case 'né':
          case 'neppure':
          case 'neanche':
          case 'nemmeno':
            break;
          default:
            toReturn.find = true;
            toReturn.avverbio = element.Text.toUpperCase();
        }
      }
    });
    return toReturn;
  }

  findNegazione(data) {
    let toReturn = {find: false, negazione: 'NON'}
    data.SyntaxTokens.forEach(element => {
      if(element.PartOfSpeech.Tag == "ADV") {
        switch (element.Text.toLowerCase()) {
          case 'no':
          case 'non':
          case 'né':
          case 'neppure':
          case 'neanche':
          case 'nemmeno':
            toReturn.find = true;
        }
      }
    });
    return toReturn;
  }

  checkEssereAvere(verbo): string {
    switch (verbo) {
      case 'sono':
      case 'sei':
      case 'è':
      case 'siamo':
      case 'siete':
      case 'ero':
      case 'eri':
      case 'era':
      case 'eravamo':
      case 'eravate':
      case 'erano':
        return 'ESSERE';
      case 'ho':
      case 'hai':
      case 'ha':
      case 'abbiamo':
      case 'avete':
      case 'hanno':
      case 'avevo':
      case 'avevi':
      case 'aveva':
      case 'avevamo':
      case 'avevate':
      case 'avevano':
        return 'AVERE';
      default:
        return '';
    }
  }

  analyzeText(data) {
    this.analyzedText = "";
    for (let d of data['SyntaxTokens']) {
      let id = d['TokenId'];
      let text = d['Text'];
      let partOfSpeech = d['PartOfSpeech']['Tag'];
      this.analyzedText += id + ': \"' + text + '\" - ' + partOfSpeech + '<br/>';
    }
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  operUserProfile() {
    this.navCtrl.push(UserProfilePage, {
      usr: this.usr,
      utenteLoggato: this.usr
    })
  }

}
