import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { LoginPage } from '../login/login';
import { AddSocialPage } from '../add-social/add-social';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  private nome: string = "";
  private cognome: string = "";
  private numero: string = "";
  private email: string = "";
  private password: string = "";
  private photoPath: string = "";
  private rPassword: string = "";
  private socials: {} = null;
  private key: string = "";

  constructor(public gestioneUtente: GestioneUtenteProvider, public navCtrl: NavController, public navParams: NavParams, private alertController: AlertController, private platform: Platform, private camera: Camera, private actionSheetCtrl: ActionSheetController) {

    if (this.navParams.get("socials") != null && this.navParams.get("socials") != undefined) {
      this.socials = this.navParams.get("socials");
    }

    if (this.navParams.get("listElement")) {
      this.email = this.navParams.get("listElement")[0];
      this.password = this.navParams.get("listElement")[1];
      this.nome = this.navParams.get("listElement")[2];
      this.cognome = this.navParams.get("listElement")[3];
      this.numero = this.navParams.get("listElement")[4];
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

  onRegister() {
    if (this.nome.trim() != "" && this.cognome.trim() != "" && this.email != ""
      && this.password != "" && this.rPassword != "") {
      if (this.password != this.rPassword) {
        this.alertController.create({
          title: "Errore",
          message: "I campi Password e Ripeti Password devono essere uguali"
        }).present();
      } else {
        this.gestioneUtente.register(this.photoPath, this.nome, this.cognome, this.numero, this.email, this.password, this.socials);
        this.navCtrl.push(LoginPage, {
          email: this.email
        });
      }
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
        socials: this.socials
      });
    } else {
      this.navCtrl.push(AddSocialPage, {
        listElement: listElement,
        socials: null
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
