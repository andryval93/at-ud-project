import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Utente } from '../../entity/utente';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { Storage } from '@ionic/storage';
import { UserProfilePage } from '../user-profile/user-profile';

/**
 * Generated class for the CreditsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class CreditsPage {

  private usr: Utente;
  private admin: boolean = false;

  constructor(private app: App, private storage: Storage, private gestioneUtente: GestioneUtenteProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreditsPage');
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
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
