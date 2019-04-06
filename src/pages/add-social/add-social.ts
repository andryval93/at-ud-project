import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegistrationPage } from '../registration/registration';
import { ModificaProfiloPage } from '../modifica-profilo/modifica-profilo';

/**
 * Generated class for the AddSocialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-social',
  templateUrl: 'add-social.html',
})
export class AddSocialPage {

  private socials: {} = {};
  private facebook: string;
  private google: string;
  private instagram: string;
  private linkedin: string;
  private telegram: string;
  private twitter: string;
  private whatsapp: string;
  private youtube: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (navParams.get("socials") != null) {
      this.socials = navParams.get("socials")

      if (this.socials["facebook"] != null) {
        this.facebook = this.socials["facebook"]
      }

      if (this.socials["instagram"] != null) {
        this.instagram = this.socials["instagram"]
      }

      if (this.socials["linkedin"] != null) {
        this.linkedin = this.socials["linkedin"]
      }

      if (this.socials["telegram"] != null) {
        this.telegram = this.socials["telegram"]
      }

      if (this.socials["twitter"] != null) {
        this.twitter = this.socials["twitter"]
      }

      if (this.socials["whatsapp"] != null) {
        this.whatsapp = this.socials["whatsapp"]
      }

      if (this.socials["youtube"] != null) {
        this.youtube = this.socials["youtube"]
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSocialPage');
  }

  onRegister() {
    var edit = false;
    if (this.navParams.get('edit') != null && this.navParams.get('edit') != undefined) edit = this.navParams.get('edit');

    if (this.facebook != "") {
      this.socials["facebook"] = this.facebook
    }

    if (this.google != "") {
      this.socials["google"] = this.google
    }

    if (this.instagram != "") {
      this.socials["instagram"] = this.instagram
    }

    if (this.linkedin != "") {
      this.socials["linkedin"] = this.linkedin
    }

    if (this.telegram != "") {
      this.socials["telegram"] = this.telegram
    }

    if (this.twitter != "") {
      this.socials["twitter"] = this.twitter
    }

    if (this.whatsapp != "") {
      this.socials["whatsapp"] = this.whatsapp
    }

    if (this.youtube != "") {
      this.socials["youtube"] = this.youtube
    }

    if (!edit) {
      this.navCtrl.push(RegistrationPage, {
        bambino: this.navParams.get('bambino'),
        bambiniList: this.navParams.get("bambiniList"),
        listElement: this.navParams.get("listElement"),
        socials: this.socials
      });
    } else {
      this.navCtrl.push(ModificaProfiloPage, {
        bambino: this.navParams.get('bambino'),
        bambiniList: this.navParams.get("bambiniList"),
        listElement: this.navParams.get("listElement"),
        socials: this.socials,
        usr: this.navParams.get('usr')
      });
    }
  }

  onBack() {
    var edit = false;
    if (this.navParams.get('edit') != null && this.navParams.get('edit') != undefined) edit = this.navParams.get('edit');

    if (!edit) {
      this.navCtrl.push(RegistrationPage, {
        bambino: this.navParams.get('bambino'),
        bambiniList: this.navParams.get("bambiniList"),
        listElement: this.navParams.get("listElement"),
        socials: this.navParams.get("socials")
      });
    } else {
      this.navCtrl.push(ModificaProfiloPage, {
        bambino: this.navParams.get('bambino'),
        bambiniList: this.navParams.get("bambiniList"),
        listElement: this.navParams.get("listElement"),
        socials: this.navParams.get("socials"),
        usr: this.navParams.get('usr')
      });
    }
  }

}
