import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GestioneWordsProvider } from '../../providers/gestione-words/gestione-words';
import { Storage } from '@ionic/storage';
import { UserProfilePage } from '../user-profile/user-profile';

/**
 * Generated class for the AslSinglePageWordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-asl-single-page-word',
  templateUrl: 'asl-single-page-word.html',
})
export class AslSinglePageWordPage {
  public image;
  public usr: any;
  constructor(public storage: Storage, public gestioneWords: GestioneWordsProvider, public navParams: NavParams, public navCtrl: NavController) {
    this.image = navParams.get("image");
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AslSinglePageWordPage');
    this.image = this.navParams.get("image");
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewWillEnter() {
    this.image = this.navParams.get("image");
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  onClick() {
    this.gestioneWords.wordLearned(this.image, this.usr.id);
    alert("Compliments! Word learned!");
    this.navCtrl.pop();
  }
}
