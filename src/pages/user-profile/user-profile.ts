import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utente } from '../../entity/utente';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { ModificaProfiloPage } from '../modifica-profilo/modifica-profilo';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { GestioneWordsProvider } from '../../providers/gestione-words/gestione-words';
import { AslSinglePageWordPage } from '../asl-single-page-word/asl-single-page-word';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  private usr: any;
  private socials: {} = {};
  private numberOfSocials: number = 0;
  private utenteLoggato: Utente;
  private learnedWords: Array<string> = new Array<string>();

  constructor(private gestioneWords: GestioneWordsProvider, private emailComposer: EmailComposer, private call: CallNumber, private storage: Storage, private gestioneUtente: GestioneUtenteProvider, public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get("utenteLoggato") != undefined && this.navParams.get("utenteLoggato") != null) {
      this.utenteLoggato = this.navParams.get("utenteLoggato");
    } else {
      this.gestioneUtente.getUtenteLoggato().then(usr => {
        this.utenteLoggato = usr;
      })
    }

    this.usr = this.navParams.get("usr");

    this.gestioneUtente.getSocials(this.usr.id).then(res => {
      this.socials = res;
      if (this.socials["whatsapp"] != null) {
        this.socials["whatsapp"] = "https://api.whatsapp.com/send?phone=" + this.socials['whatsapp'];
      }

      this.numberOfSocials = Object.keys(this.socials).length;

      this.gestioneWords.getUserWords(this.usr.id).then(res => {
        this.learnedWords = res;
      })
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
    if (this.navParams.get("utenteLoggato") != undefined && this.navParams.get("utenteLoggato") != null) {
      this.utenteLoggato = this.navParams.get("utenteLoggato");
    } else {
      this.gestioneUtente.getUtenteLoggato().then(usr => {
        this.utenteLoggato = usr;
      })
    }

    this.usr = this.navParams.get("usr");

    this.gestioneWords.getUserWords(this.usr.id).then(res => {
      this.learnedWords = res;
    })
  }

  ionViewWillEnter() {
    if (this.navParams.get("utenteLoggato") != undefined && this.navParams.get("utenteLoggato") != null) {
      this.utenteLoggato = this.navParams.get("utenteLoggato");
    } else {
      this.gestioneUtente.getUtenteLoggato().then(usr => {
        this.utenteLoggato = usr;
      })
    }

    this.usr = this.navParams.get("usr");

    this.gestioneWords.getUserWords(this.usr.id).then(res => {
      this.learnedWords = res;
    })
  }

  editProfile() {
    var listElement: Array<any> = new Array<any>();

    listElement[0] = this.usr.email;
    listElement[1] = "";
    listElement[2] = this.usr.nome;
    listElement[3] = this.usr.cognome;
    listElement[4] = this.usr.numero;

    this.navCtrl.push(ModificaProfiloPage, {
      usr: this.usr,
      socials: this.socials,
      listElement: listElement
    })
  }

  callNumber(number) {
    this.call.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  sendEmail(email) {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        let emailOpt = {
          to: email
        };

        this.emailComposer.open(emailOpt);
      }
    });

  }

  openImage(image) {
    this.navCtrl.push(AslSinglePageWordPage, {
      image: image
    })
  }

}
