import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

import { FirstPage } from '../pages/firstPage/firstPage';
import { GestioneUtenteProvider } from '../providers/gestione-utente/gestione-utente';

declare var AWS;
console.log("AWS test",AWS);


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = FirstPage;

  constructor(private gestioneUtente: GestioneUtenteProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private androidPermissions: AndroidPermissions) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (platform.is('android')) {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          .then(err =>
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
          );

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]);

        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          .then(err =>
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          );

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);

        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then(err =>
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
          );

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
      }

      
    });
  }
}
