import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

/*
  Generated class for the GetioneWordsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GestioneWordsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GestioneWordsProvider Provider');
  }

  wordLearned(wordPath: string, user: string) {
    firebase.database().ref("Words/" + user).push(wordPath);
  }

  getUserWords(user: string) {
    var wordlist: Array<string> = new Array<string>();
    return new Promise<Array<string>>((resolve, reject) => {
      firebase.database().ref("Words/" + user).once("value", res => {
        Object.keys(res.val()).forEach(elem => {
          if (wordlist.indexOf(res.val()[elem]) < 0) {
            wordlist.push(res.val()[elem]);
          }
        })
        resolve(wordlist);
      });
    });
  }

}
