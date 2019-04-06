import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  private email: string;

  constructor(private gestioneUtente: GestioneUtenteProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  onSend(){
    this.gestioneUtente.forgotPassword(this.email).then((control) => {if (control) this.navCtrl.pop()})
  }

}
