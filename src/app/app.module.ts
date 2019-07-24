import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AddSocialPage } from '../pages/add-social/add-social';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { CreditsPage } from '../pages/credits/credits';
import { FirstPage } from '../pages/firstPage/firstPage';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { HelpPage } from '../pages/help/help';
import { LoginPage } from '../pages/login/login';
import { ModificaProfiloPage } from '../pages/modifica-profilo/modifica-profilo';
import { RegistrationPage } from '../pages/registration/registration';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { GestioneUtenteProvider } from '../providers/gestione-utente/gestione-utente';
import { GestioneHelpProvider } from '../providers/gestione-help/gestione-help';

import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import * as firebase from 'firebase';
import { Vibration } from '@ionic-native/vibration';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { LisSinglePageAlphabetPage } from '../pages/lis-single-page-alphabet/lis-single-page-alphabet';
import { AslSinglePageWordPage } from '../pages/asl-single-page-word/asl-single-page-word';
import { AslWordsPage } from '../pages/asl-words/asl-words';
import { SpeechPage } from '../pages/speech/speech';
import { GestioneWordsProvider } from '../providers/gestione-words/gestione-words';
import { Keyboard } from '@ionic-native/keyboard';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TranslatePage } from '../pages/translate/translate';


export const config = {
  apiKey: "AIzaSyC305cznoM_BAt-S92IDwxY-p8e18Z_AlM",
  authDomain: "signpro-ded39.firebaseapp.com",
  databaseURL: "https://signpro-ded39.firebaseio.com",
  projectId: "signpro-ded39",
  storageBucket: "signpro-ded39.appspot.com",
  messagingSenderId: "438657659909"
};

firebase.initializeApp(config);
firebase.storage();

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    AddSocialPage,
    ChangePasswordPage,
    CreditsPage,
    FirstPage,
    ForgotPasswordPage,
    HelpPage,
    LoginPage,
    ModificaProfiloPage,
    RegistrationPage,
    UserProfilePage,
    LisSinglePageAlphabetPage,
    AslSinglePageWordPage,
    AslWordsPage,
    SpeechPage,
    TranslatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    AddSocialPage,
    ChangePasswordPage,
    CreditsPage,
    FirstPage,
    ForgotPasswordPage,
    HelpPage,
    LoginPage,
    ModificaProfiloPage,
    RegistrationPage,
    UserProfilePage,
    LisSinglePageAlphabetPage,
    AslSinglePageWordPage,
    AslWordsPage,
    SpeechPage,
    TranslatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SpeechRecognition,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GestioneUtenteProvider,
    GestioneHelpProvider,
    Camera,
    GestioneUtenteProvider,
    Facebook,
    GooglePlus,
    AndroidPermissions,
    CallNumber,
    EmailComposer,
    GestioneHelpProvider,
    AndroidPermissions,
    Vibration,
    File,
    FileTransfer,
    GestioneWordsProvider,
    Keyboard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
