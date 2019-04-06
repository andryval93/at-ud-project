import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AslSinglePageWordPage } from '../asl-single-page-word/asl-single-page-word';
import { UserProfilePage } from '../user-profile/user-profile';
import { Utente } from '../../entity/utente';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AslWordsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-asl-words',
  templateUrl: 'asl-words.html',
})
export class AslWordsPage {
  searchTerm: string = "";
  posts: any;
  values: any;
  usr: Utente;

  constructor(public storage: Storage, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.onClick();
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AslWordsPage');
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewWillEnter() {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  onClick() {
    //var link = 'http://api.giphy.com/v1/gifs/3o6ZsY2HqqL8vVhxEA' + '&api_key=WYBOoj4gFUUsUQjUCB1gUr5Er7WqbckE&limit=5';
    
    var link = 'http://api.giphy.com/v1/gifs/search?q=american+sign+language+with+robert+' + this.searchTerm.replace(/ /g, '+') + '&api_key=WYBOoj4gFUUsUQjUCB1gUr5Er7WqbckE&limit=5';
    //var link = 'https://giphy.com/search/@signwithrobert-friday&api_key=WYBOoj4gFUUsUQjUCB1gUr5Er7WqbckE'
    //alert(link)
    this.http.get(link).map(res => res.json()).subscribe(data => {
      this.values = data.data;
      console.log(data.data)
    });
  }

  openImage(image) {
    this.navCtrl.push(AslSinglePageWordPage, {
      image: image
    })
  }

  operUserProfile() {
    this.navCtrl.push(UserProfilePage, {
      usr: this.usr,
      utenteLoggato: this.usr
    })
  }

}
