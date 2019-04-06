import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utente } from '../../entity/utente';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  private nPassword: string;
  private vPassword: string;
  private rPassword: string;
  private usr: Utente;


  constructor(private gestioneUtente: GestioneUtenteProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.usr = this.navParams.get("usr");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  onChangePassword(){
    if (this.nPassword == this.rPassword){
      this.gestioneUtente.changePassword(this.usr.getEmail(), this.vPassword, this.nPassword);
      this.navCtrl.pop();
    } else {
      alert("I campi 'Nuova Password' e 'Ripeti Nuova Password' devono essere uguali.")
    }
  }

}
