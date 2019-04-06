import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegistrationPage } from '../registration/registration';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-firstPage',
  templateUrl: 'firstPage.html',
})
export class FirstPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, private gestioneUtente: GestioneUtenteProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

  showLogInPage() {
    this.navCtrl.push(LoginPage);
  }

  showRegistrationPage() {
    this.navCtrl.push(RegistrationPage);
  }

  loginWithFacebook() {
    this.gestioneUtente.loginWithFacebook().then(res => {
      this.gestioneUtente.setCallId(res.getId())
        this.navCtrl.push(TabsPage, {
          utente: res
        });
    })

  }

  loginWithGoogle() {
    this.gestioneUtente.loginWithGoogle().then(res => {
      this.gestioneUtente.setCallId(res.getId())
        this.navCtrl.push(TabsPage, {
          utente: res
        });
    })
  }

}
