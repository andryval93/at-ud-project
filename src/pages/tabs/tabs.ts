import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { AslWordsPage } from '../asl-words/asl-words';
import { SpeechPage } from '../speech/speech';
import { LisSinglePageAlphabetPage } from '../lis-single-page-alphabet/lis-single-page-alphabet';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LisSinglePageAlphabetPage;
  tab2Root = AslWordsPage;
  tab3Root = SpeechPage;
  tab4Root = HomePage;

  constructor(private navParams: NavParams, private storage: Storage) {
    this.storage.set('usr', this.navParams.get('utente'));
  }
}
