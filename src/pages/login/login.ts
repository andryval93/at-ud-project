import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { Storage } from '@ionic/storage';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private username: string = "";
  private password: string = "";
  private connesso: boolean = false;

  constructor(private storage: Storage, public navCtrl: NavController, public navParams: NavParams, public gestioneUtente: GestioneUtenteProvider, private alertController: AlertController) {
    storage.get("email").then((email) => {
      storage.get("password").then((password) => {
        if (email && password) {
          this.connesso = true;
          this.username = email;
          this.password = password;
          this.onLogin();
        }
      });
    });
  }

  onClick() {
    if (this.connesso) {
      this.connesso = false;
      this.storage.get('email').then(email => {
        this.storage.get('password').then(password => {
          if (email && password) {
            this.storage.remove('email');
            this.storage.remove('password');
          }
        })
      })
      this.username = "";
      this.password = "";
    } else {
      this.connesso = true;
    }

  }

  onLogin() {
    this.navCtrl.push(TabsPage, {
      utente: {},
      callId: 'id'
    });
    /* this.gestioneUtente.login(this.username, this.password).then(result => {
      if (result == true) {
        if (this.connesso) {
          this.storage.get('email').then(email => {
            this.storage.get('password').then(password => {
              if (!email && !password) {
                this.storage.set('email', this.username);
                this.storage.set('password', this.password);
              }
            });
          });
        }
        this.gestioneUtente.getUtenteLoggato().then(res => {
          this.gestioneUtente.setCallId(res.getId()).then(id => {
            this.navCtrl.push(TabsPage, {
              utente: res,
              callId: id
            });
          })
        });
      } else {
        this.alertController.create({
          title: "Errore",
          message: "Email o Password errati o account non registrato"
        }).present();
      }
    }); */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onForgot() {
    this.navCtrl.push(ForgotPasswordPage);
  }

}
