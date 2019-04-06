import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

/*
  Generated class for the GestioneHelpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GestioneHelpProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GestioneHelpProvider Provider');
  }

  sendNewMessage(subject: string, category: string, message: string, user: string){
    var refHelp = firebase.database().ref("Help").push();
    refHelp.set({oggetto: subject, categoria: category, messaggio: message, email: user, data: this.pad(new Date().getDate()) + "/" + this.pad(new Date().getMonth() + 1) + "/" + new Date().getFullYear(), ora: this.pad(new Date().getHours()) + ":" + this.pad(new Date().getMinutes()) }).then(res =>{
      refHelp.remove();
    }) 
  }

  pad(n) {
    return n < 10 ? "0" + n : n;
  }

}
