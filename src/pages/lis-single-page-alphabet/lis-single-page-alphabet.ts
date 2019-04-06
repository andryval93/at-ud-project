import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utente } from '../../entity/utente';
import { Storage } from '@ionic/storage';
import { UserProfilePage } from '../user-profile/user-profile';



/**
 * Generated class for the LisSinglePageAlphabetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lis-single-page-alphabet',
  templateUrl: 'lis-single-page-alphabet.html',
})
export class LisSinglePageAlphabetPage {
  usr: Utente;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LisSinglePageAlphabetPage');
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
