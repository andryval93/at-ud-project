import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { Utente } from '../../entity/utente';
import { EmailComposer } from '@ionic-native/email-composer';
import { GestioneHelpProvider } from '../../providers/gestione-help/gestione-help';
import { Storage } from '@ionic/storage';
import { UserProfilePage } from '../user-profile/user-profile';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  private usr: Utente;
  private subject: string = "";
  private messaggio: string = "";
  private category: string = "";

  constructor(private app: App, private storage: Storage, private gestioneHelp: GestioneHelpProvider, private email: EmailComposer, private gestioneUtente: GestioneUtenteProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewWillEnter() {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  send() {
    if (this.subject.trim() == "") {
      alert("Si prega di inserire l'oggetto del messaggio.")
    }

    if (this.category.trim() == "") {
      alert("Si prega di inserire la categoria del messaggio.")
    }

    if (this.messaggio.trim() == "") {
      alert("Si prega di inserire il messaggio.")
    }

    if (this.subject.trim() != "" && this.category.trim() != "" && this.messaggio.trim() != "") {
      this.gestioneHelp.sendNewMessage(this.subject, this.category, this.messaggio, this.usr.getEmail());
      alert("Messaggio inviato!");
      this.navCtrl.pop();
    }
      
  }

  operUserProfile() {
    this.navCtrl.push(UserProfilePage, {
      usr: this.usr,
      utenteLoggato: this.usr
    })
  }

}
