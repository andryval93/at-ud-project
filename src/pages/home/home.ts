import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { GestioneUtenteProvider } from '../../providers/gestione-utente/gestione-utente';
import { Utente } from '../../entity/utente';
import { Storage } from '@ionic/storage';
import { UserProfilePage } from '../user-profile/user-profile';

declare var apiRTC: any

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private utentiList: Utente[] = new Array();
  private callee: string;
  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;
  usr: any;

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;

  constructor(public storage: Storage, public navParams: NavParams, private gestioneUtente: GestioneUtenteProvider, private platform: Platform, public navCtrl: NavController, public vibration: Vibration) {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });

    this.gestioneUtente.getUtenti().then(res => {
      this.utentiList = res;
      this.utentiList.forEach(elem => {
        if (elem.getId() == this.usr.id) {
          this.utentiList.splice(this.utentiList.indexOf(elem), 1);
        }
      })
    })


    this.InitializeApiRTC();

    this.platform.pause.subscribe(() => {
      if (this.showAnswer == false && this.showReject == false && this.showHangup == true && this.showCall == false) {
        this.RejectCall(this.incomingCallId);
      }
    });

  }

  ionViewWillEnter() {
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AggiungiAnnuncioPage');
    this.storage.get('usr').then(res => {
      this.usr = res;
    });
    this.gestioneUtente.getUtenti().then(res => {
      this.utentiList = res;
      this.utentiList.forEach(elem => {
        if (elem.getId() == this.usr.id) {
          this.utentiList.splice(this.utentiList.indexOf(elem), 1);
        }
      })
    });
  }

  InitializeApiRTC() {
    this.myCallId = apiRTC.session.apiCCId;
    this.sessionReadyHandler();
  }

  sessionReadyHandler() {
    this.InitializeControls();
    this.AddEventListeners();
    this.InitializeWebRTCClient();
  }

  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
  }

  InitializeControls() {
    this.showCall = true;
    this.showAnswer = false;
    this.showHangup = false;
    this.showReject = false;
  }

  InitializeControlsForIncomingCall() {
    this.showCall = false;
    this.showAnswer = true;
    this.showReject = true;
    this.showHangup = true;
    var check = false;
    var i = 0;
    var timer = setInterval(() => {
      this.vibrate();
      if (this.showAnswer == false && this.showReject == false && this.showHangup == true) {
        clearInterval(timer);
        check = true;
      }
      i = i + 1;
      if (check == false && i > 10) {
        this.RejectCall(this.incomingCallId);
        clearInterval(timer);
        alert("La chiamata è stata rifiutata in quanto non hai riposto per più di 10 secondi")
      }
    }, 5000);


  }

  InitializeControlsForHangup() {
    this.showCall = true;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
  }

  UpdateControlsOnAnswer() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = true;
    this.showCall = false;
  }

  UpdateControlsOnReject() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
    this.showCall = true;
  }

  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

  AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
    let mediaElt = null;
    let divElement = null;

    if (callType === 'audio') {
      mediaElt = document.createElement("audio");
    } else {
      mediaElt = document.createElement("video");
    }

    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);

    this.webRTCClient.attachMediaStream(mediaElt, stream);
  }

  AddEventListeners() {
    apiRTC.addEventListener("userMediaSuccess", (e) => {
      this.showStatus = true;
      this.showMyVideo = true;

      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
        width: "128px",
        height: "96px"
      }, true);

    });

    apiRTC.addEventListener("userMediaError", (e) => {
      this.InitializeControlsForHangup();

      this.status = this.status + "<br/> The following error has occurred <br/> " + e;
    });

    apiRTC.addEventListener("incomingCall", (e) => {
      this.InitializeControlsForIncomingCall();
      this.incomingCallId = e.detail.callId;
    });

    apiRTC.addEventListener("hangup", (e) => {
      if (e.detail.lastEstablishedCall === true) {
        this.InitializeControlsForHangup();
      }
      this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
      this.RemoveMediaElements(e.detail.callId);
    });

    apiRTC.addEventListener("remoteStreamAdded", (e) => {
      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
        width: "300px",
        height: "225px"
      }, false);
    });

    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);

      /*      this.InitializeControls();
            this.AddEventListeners();*/

      //this.MakeCall("729278");
    });

  }

  MakeCall() {
    this.gestioneUtente.getCallId(this.callee).then(res => {
      var callId = this.webRTCClient.call(res);
      if (callId != null) {
        this.incomingCallId = callId;
        this.showHangup = true;
      }
    })

    var check = false;
    var i = 0;
    var timer = setInterval(() => {
      if (this.showAnswer == false && this.showReject == false && this.showHangup == true) {
        clearInterval(timer);
        check = true;
      }
      i = i + 1;
      if (check == false && i > 10) {
        this.RejectCall(this.incomingCallId);
        clearInterval(timer);
        alert("La chiamata è stata rifiutata in quanto non si è ricevuto risposta per più di 10 secondi")
      }
    }, 5000);


  }

  HangUp() {
    this.webRTCClient.hangUp(this.incomingCallId);
  }

  AnswerCall(incomingCallId) {
    this.webRTCClient.acceptCall(incomingCallId);
    this.vibration.vibrate(0);
    //NativeAudio.stop('uniqueI1').then(()=>{},()=>{});
    this.UpdateControlsOnAnswer();
  }

  RejectCall(incomingCallId) {
    this.webRTCClient.refuseCall(incomingCallId);
    this.vibration.vibrate(0);
    this.UpdateControlsOnReject();
    this.RemoveMediaElements(incomingCallId);
  }

  vibrate() {
    this.vibration.vibrate([1000, 500, 2000]);
  }

  operUserProfile() {
    this.navCtrl.push(UserProfilePage, {
      usr: this.usr,
      utenteLoggato: this.usr
    })
  }
}