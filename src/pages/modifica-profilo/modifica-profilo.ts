import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { AddSocialPage } from '../add-social/add-social';
import { Utente } from '../../entity/utente';
import { ChangePasswordPage } from '../change-password/change-password';
import { HomePage } from '../home/home';

/**
 * Generated class for the ModificaProfiloPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modifica-profilo',
  templateUrl: 'modifica-profilo.html',
})
export class ModificaProfiloPage {
  private usr: any;
  private nome: string = "";
  private cognome: string = "";
  private numero: string = "";
  private email: string = "";
  private password: string = "";
  private photoPath: string = "";
  private socials: {} = null;
  

  constructor(public gestioneUtente: GestioneUtenteProvider, public navCtrl: NavController, public navParams: NavParams, private alertController: AlertController, private platform: Platform, private camera: Camera, private actionSheetCtrl: ActionSheetController) {
    this.usr = navParams.get('usr');
    this.photoPath = this.usr.photoPath;
    
    if (this.navParams.get("socials") != null && this.navParams.get("socials") != undefined) {
      this.socials = this.navParams.get("socials");
    }

    if (this.navParams.get("listElement")) {
      this.email = this.navParams.get("listElement")[0];
      this.nome = this.navParams.get("listElement")[2];
      this.cognome = this.navParams.get("listElement")[3];
      this.numero = this.navParams.get("listElement")[4];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModificaProfiloPage');
  }

  onPassword() {
    this.navParams.get("listElement")[0] = this.email;
    this.navParams.get("listElement")[2] = this.nome;
    this.navParams.get("listElement")[3] = this.cognome;
    this.navParams.get("listElement")[4] = this.numero;
    this.navCtrl.push(ChangePasswordPage, {
      listElement: this.navParams.get("listElement"),
      usr: this.usr
    })
  }

  onRegister() {
    if (this.nome.trim() != "" && this.cognome.trim() != "" && this.email != "") {
      this.gestioneUtente.removeUser(this.usr.id);
      this.gestioneUtente.editUserInformation(this.usr.id, this.usr.admin, this.photoPath, this.nome, this.cognome, this.numero, this.email, this.socials);
      this.navCtrl.push(HomePage, {
        email: this.email
      });
    } else {
      this.alertController.create({
        title: "Errore",
        message: "Uno o più parametri mancanti"
      }).present();
    }
  }

  onAddSocial() {
    var listElement: string[] = new Array();
    if (this.email != "") {
      listElement.push(this.email);
    } else
      listElement.push("");

    if (this.password != "") {
      listElement.push(this.password);
    } else
      listElement.push("");

    if (this.nome != "") {
      listElement.push(this.nome);
    } else
      listElement.push("");

    if (this.cognome != "") {
      listElement.push(this.cognome);
    } else
      listElement.push("");

    if (this.numero != "") {
      listElement.push(this.numero);
    } else
      listElement.push("");

    if (this.socials != null) {
      this.navCtrl.push(AddSocialPage, {
        listElement: listElement,
        socials: this.socials,
        edit: true,
        usr: this.usr
      });
    } else {
      this.navCtrl.push(AddSocialPage, {
        listElement: listElement,
        socials: null,
        edit: true,
        usr: this.usr
      });
    }

  }

  
  onPhoto() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Scegli una foto',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Scatta una Foto',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.takephoto();
          }
        },
        {
          text: 'Scegli da Galleria',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.openGallery();
          }
        },
      ]
    });
    actionSheet.present();
  }

  takephoto() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.photoPath = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      // Handle error
    })
  }

  openGallery() {

    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.photoPath = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      // Handle error
    })
  }


}
