import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Utente } from '../../entity/utente';
import { Storage } from '@ionic/storage';

declare var apiRTC: any;

/*
  Generated class for the GestioneUtenteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GestioneUtenteProvider {
  private pin: string;

  constructor(private storage: Storage, public http: HttpClient, public facebook: Facebook, public google: GooglePlus) {
    console.log('Hello GestioneUtenteProvider Provider');
  }

  login(email: string, password: string): Promise<any> {
    var promise: Promise<any> = new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(success => {
        resolve(true);
      }).catch(function (error) {
        resolve(error);
      })
    });
    return promise;
  }

  logout() {
    var promise: Promise<any> = new Promise((resolve, reject) => {
      if (this.storage.get('usr') != undefined && this.storage.get('usr') != null) {
        this.storage.remove('usr');
      }
      firebase.auth().signOut().then(function () {
        resolve(true)
      })
        .catch(function (error) {
          resolve(error)
        });
    });
    return promise;
  }

  register(photoPath: string, nome: string, cognome: string, numero: string, email: string, password: string, socials: {}) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(utente => {
      var refUtente = firebase.database().ref("Utente").push();
      refUtente.set({ nome: nome, cognome: cognome, numero: numero, email: email, photoPath: photoPath, isAdmin: false, pin: this.makeid(), firstAccess: true });
      this.addSocial(refUtente.key, socials);

    }).catch((error) => { alert("Errore nella registrazione: " + error) });

  }

  editUserInformation(id: string, admin: boolean, photoPath: string, nome: string, cognome: string, numero: string, email: string, socials: {}) {
    var refUtente = firebase.database().ref("Utente/" + id);
    refUtente.set({ nome: nome, cognome: cognome, numero: numero, email: email, photoPath: photoPath, isAdmin: admin, firstAccess: false })
    this.addSocial(id, socials);

  }

  changePassword(email, oldPassword, newPassword) {
    firebase.auth()
      .signInWithEmailAndPassword(email, oldPassword)
      .then(function (user) {
        firebase.auth().currentUser.updatePassword(newPassword).then(function () {
        }).catch(function (err) {
          alert("Non è stato possibile cambiare la password: " + JSON.stringify(err))
        });

      }).catch(function (err) {
        alert("Password attuale errata.")
      });
  }

  getUtenteLoggato(): Promise<Utente> {
    var promise: Promise<Utente> = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var utenteRef = firebase.database().ref("Utente").orderByChild("email").equalTo(user.email);
          utenteRef.once('child_added', snapshot => {
            this.getUtente(snapshot.key).then(res => {
              resolve(res);
            })
          });
        } else {
          reject();
        }
      });
    });

    return promise;
  }

  registerAdmin(photoPath: string, nome: string, cognome: string, numero: string, email: string, password: string, socials: { social: string, nomeSocial: string }[], mansione) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(utente => {
      var refUtente = firebase.database().ref("Utente").push();
      refUtente.set({ nome: nome, cognome: cognome, numero: numero, email: email, photoPath: photoPath, isAdmin: true, mansione: mansione });

      socials.forEach(social => {
        firebase.database().ref("Utente/" + refUtente.key + "/Social").push(social);
      });

    }).catch((error) => { alert("Errore nella registrazione: " + error) });

  }

  makeid() {
    this.pin = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-,#@/*+?!£$%&";

    for (var i = 0; i < 20; i++)
      this.pin += possible.charAt(Math.floor(Math.random() * possible.length));

    return this.pin;

  }

  forgotPassword(email: string) {
    return new Promise<boolean>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(
        email)
        .then(function () {
          alert("Un'email è stata inviata a " + email + " per procedere con il reset della password.")
          resolve(true);
        })
        .catch(function (error) {
          alert("Non è stato possibile completare la richiesta: " + JSON.stringify(error))
          resolve(false);
        });
    })
  }

  checkIfAlreadyExist(success): Promise<any> {
    var toReturn: any;
    var promise: Promise<any> = new Promise<any>((resolve, reject) => {
      firebase.database().ref().child("Utente").once('value', res => {
        if (res.val() != null) {
          var userRef = firebase.database().ref("Utente")
          userRef.on("value", (snapshot) => {
            var check = snapshot.forEach(elem => {
              if (elem.val().email == success.email) {
                toReturn = elem;
                return true;
              } else {
                return false;
              }
            });

            if (check) {
              resolve(toReturn);
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      })
    })

    return promise;
  }


  loginWithFacebook(): Promise<any> {

    var promise: Promise<any> = new Promise((resolve, reject) => {
      this.facebook.login(['email']).then(response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);
        var refUtente = firebase.database().ref("Utente").push();

        firebase.auth().signInWithCredential(facebookCredential)
          .then(success => {
            this.checkIfAlreadyExist(success).then(result => {

              var u = new Utente(refUtente.key, success.displayName.split(" ")[0], success.displayName.split(" ")[1], success.phoneNumber, success.email,
                success.photoURL, success.callID);
              u.addSocial("http://www.facebook.com/profile.php?id=" + success.providerData[0].uid, "facebook");

              if (result == null) {
                refUtente.set({
                  nome: success.displayName.split(" ")[0], cognome: success.displayName.split(" ")[1], numero: success.phoneNumber,
                  email: success.email, photoPath: success.photoURL, isAdmin: false, pin: this.makeid(), firstAccess: true, facebook: "http://www.facebook.com/profile.php?id=" + success.providerData[0].uid
                });
              } else {
                if (result.val().isAdmin == true) {
                  u.setAdmin();
                }
                u.setFirstAccess(result.val().firstAccess);
                //}
              }
              resolve(u);
            });
          }).catch((error) => {
            alert("Errore nell'inserimento nel database: " + error);
          });

      }).catch((error) => {
        reject()
        alert("Errore Login con Google: " + error)
      });
    });
    return promise;
  }

  loginWithGoogle(): Promise<any> {
    var promise: Promise<any> = new Promise((resolve, reject) => {
      this.google.login({
        'webClientId': '848818490465-it436oc4acjr52s1608amd9gosq6mrl2.apps.googleusercontent.com',
        'scopes': 'https://www.googleapis.com/auth/contacts.readonly profile email'
      }).then(response => {
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(response);
        var refUtente = firebase.database().ref("Utente").push();
        firebase.auth().signInWithCredential(googleCredential)
          .then(success => {
            this.checkIfAlreadyExist(success).then(result => {

              var u = new Utente(refUtente.key, success.displayName.split(" ")[0], success.displayName.split(" ")[1], success.phoneNumber, success.email,
                success.photoURL, success.callID);
              u.addSocial("https://plus.google.com/u/0/" + success.providerData[0].uid, "google");

              if (result == null) {
                refUtente.set({
                  nome: success.displayName.split(" ")[0], cognome: success.displayName.split(" ")[1], numero: success.phoneNumber,
                  email: success.email, photoPath: success.photoURL, isAdmin: false, pin: this.makeid(), firstAccess: true, google: "https://plus.google.com/u/0/" + success.providerData[0].uid
                });
              } else {
                if (result.val().isAdmin == true) {
                  u.setAdmin();
                }
                u.setFirstAccess(result.val().firstAccess);
                //}
              }
              resolve(u);
            });
          }).catch((error) => {
            alert("Errore nell'inserimento nel database: " + error);
          });

      }).catch((error) => {
        reject()
        alert("Errore Login con Google: " + error)
      });
    });
    return promise;
  }

  getUtenti() {
    var promise: Promise<any> = new Promise((resolve, reject) => {
      var toReturn: Utente[] = new Array();
      firebase.database().ref("Utente").once('value', snapshot => {
        snapshot.forEach(element => {
          var utente: Utente = new Utente(element.key, element.val().nome, element.val().cognome, element.val().numero, element.val().email,
            element.val().photoPath, element.val().callID);
          if (element.val().isAdmin == true) {
            utente.setAdmin();
          }


          if (element.val().facebook != null || element.val().facebook != undefined) {
            utente.addSocial(element.val().facebook, "facebook");
          }

          if (element.val().google != null || element.val().google != undefined) {
            utente.addSocial(element.val().google, "google");
          }

          if (element.val().instagram != null || element.val().instagram != undefined) {
            utente.addSocial(element.val().instagram, "instagram");
          }

          if (element.val().linkedin != null || element.val().linkedin != undefined) {
            utente.addSocial(element.val().linkedin, "linkedin");
          }

          if (element.val().telegram != null || element.val().telegram != undefined) {
            utente.addSocial(element.val().telegram, "telegram");
          }

          if (element.val().twitter != null || element.val().twitter != undefined) {
            utente.addSocial(element.val().twitter, "twitter");
          }

          if (element.val().whatsapp != null || element.val().whatsapp != undefined) {
            utente.addSocial(element.val().whatsapp, "whatsapp");
          }

          if (element.val().youtube != null || element.val().youtube != undefined) {
            utente.addSocial(element.val().youtube, "youtube");
          }

          utente.setFirstAccess(element.val().firstAccess);

          if (element.val().pin != undefined) {
            utente.setPin(element.val().pin)
          }

          toReturn.push(utente)
          return false;
        });
        resolve(toReturn)
      });
    });

    return promise;
  }

  verifyUser(user: Utente, code: string) {
    var promise = new Promise<boolean>((resolve, reject) => {
      var userRef = firebase.database().ref("Utente").orderByKey().equalTo(user.getId());
      userRef.on('child_added', result => {
        if (result.val().pin == code) {
          firebase.database().ref("Utente/" + user.getId()).update({ firstAccess: false });
          firebase.database().ref("Utente/" + user.getId()).update({ pin: null });
          resolve(true);
        } else {
          reject()
        }
      })
    })

    return promise;
  }

  getTag(user) {
    var promise = new Promise<Utente>((resolve, reject) => {
      if (user.val().Tags != undefined) {
        for (let tags in user.val().Tags) {
          firebase.database().ref('Utente/' + user.val().Tags[tags]).once('value', snap => {
            var utente: Utente = new Utente(user.val().Tags[tags], snap.val().nome, snap.val().cognome,
              snap.val().numero, snap.val().email, snap.val().photoPath, snap.val().callID);
            resolve(utente);
          });
        }
      } else {
        resolve(null);
      }
    });
    return promise;
  }

  getUtente(user) {
    var promise = new Promise<Utente>((resolve, reject) => {
      firebase.database().ref('Utente/' + user).once('value', snap => {
        var utente: Utente = new Utente(user, snap.val().nome, snap.val().cognome, snap.val().numero, snap.val().email, snap.val().photoPath, snap.val().callID);
        if (snap.val().isAdmin == true) {
          utente.setAdmin();
          utente.setFirstAccess(false);
        } else {
          utente.setFirstAccess(snap.val().firstAccess);
        }

        resolve(utente)
      })
    })

    return promise;

  }

  getSocials(user) {
    var socials: {} = {};
    var promise = new Promise<{}>((resolve, reject) => {
      firebase.database().ref('Utente/' + user).once('value', snap => {
        if (snap.val().facebook != undefined) {
          socials["facebook"] = snap.val().facebook
        }

        if (snap.val().google != undefined) {
          socials["google"] = snap.val().google
        }

        if (snap.val().instagram != undefined) {
          socials["instagram"] = snap.val().instagram
        }

        if (snap.val().linkedin != undefined) {
          socials["linkedin"] = snap.val().linkedin
        }

        if (snap.val().telegram != undefined) {
          socials["telegram"] = snap.val().telegram
        }

        if (snap.val().twitter != undefined) {
          socials["twitter"] = snap.val().twitter
        }

        if (snap.val().whatsapp != undefined) {
          socials["whatsapp"] = snap.val().whatsapp
        }

        if (snap.val().youtube != undefined) {
          socials["youtube"] = snap.val().youtube
        }

        resolve(socials)
      });
    });
    return promise;
  }

  addSocial(user: string, socials: {}) {
    if (socials != null && socials != undefined) {
      Object.keys(socials).forEach(key => {
        if (key == "facebook") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].startsWith("https://")) {
              this.checkUrlNot404(socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user + "/").update({ facebook: socials[key] })
                }
              })
            } else {
              this.checkUrlNot404("https://www.facebook.com/" + socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user + "/").update({ facebook: "https://www.facebook.com/" + socials[key] })
                }
              });
            }
          }
        } else if (key == "google") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].startsWith("https://")) {
              this.checkUrlNot404(socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ google: socials[key] })
                }
              })
            } else {
              this.checkUrlNot404("https://plus.google.com/+" + socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ google: "https://plus.google.com/+" + socials[key] })
                }
              });
            }
          }
        } else if (key == "instagram") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].startsWith("https://")) {
              this.checkUrlNot404(socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ instagram: socials[key] })
                }
              })
            } else {
              this.checkUrlNot404("https://www.instagram.com/" + socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ instagram: "https://www.instagram.com/" + socials[key] })
                }
              });
            }
          }
        } else if (key == "linkedin") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].startsWith("https://")) {
              this.checkUrlNot404(socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ linkedin: socials[key] })
                }
              })
            } else {
              this.checkUrlNot404("https://www.linkedin.com/in/" + socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ linkedin: "https://www.linkedin.com/in/" + socials[key] })
                }
              });
            }
          }
        } else if (key == "telegram") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].startsWith("https://")) {
              this.checkUrlNot404(socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ telegram: socials[key] })
                }
              })
            } else {
              this.checkUrlNot404("https://t.me/" + socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ telegram: "https://t.me/" + socials[key] })
                }
              });
            }
          }
        } else if (key == "twitter") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].startsWith("https://")) {
              this.checkUrlNot404(socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ twitter: socials[key] })
                }
              })
            } else {
              this.checkUrlNot404("https://twitter.com/" + socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ linkedin: "https://twitter.com/" + socials[key] })
                }
              });
            }
          }
        } else if (key == "whatsapp") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].match('[0-9]+'))
              firebase.database().ref('Utente/' + user).update({ whatsapp: "+39" + socials[key] })
            else
              alert("La stringa inserita nel campo WhatsApp non è valida. Sei sicuro di aver inserito solo numeri, senza spazi vuoti?")
          }
        } else if (key == "youtube") {
          if (socials[key] != undefined && socials[key] != null) {
            if (socials[key].startsWith("https://")) {
              this.checkUrlNot404(socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ youtube: socials[key] })
                }
              })
            } else {
              this.checkUrlNot404("https://www.youtube.com/channel/" + socials[key], key).then(res => {
                if (res == true) {
                  firebase.database().ref('Utente/' + user).update({ youtube: "https://www.youtube.com/channel/" + socials[key] })
                }
              });
            }
          }
        }
      });
    }
  }

  checkUrlNot404(url, social) {
    var promise = new Promise<boolean>((resolve, reject) => {
      var http = new XMLHttpRequest();
      http.open('HEAD', url, true);
      http.send();
      if (http.status != 404) {
        resolve(true);
      }
      else {
        alert("L'indirizzo o nome utente inserito nel campo " + social + " non è valido.");
        resolve(false);
      }
    });
    return promise;

  }

  removeUser(user: string) {
    firebase.database().ref("Utente/" + user).remove();
  }

  setCallId(userId: string) {
    return new Promise((resolve, reject) => {
      apiRTC.init({
        apiKey: "819abef1fde1c833e0601ec6dd4a8226",
        // apiCCId : "2",
        onReady: (e) => {
          firebase.database().ref("Utente/" + userId).update({ "callID": apiRTC.session.apiCCId });
          resolve(apiRTC.session.apiCCId);
        }
      });
    });
  }

  removeCallId() {
    this.getUtenteLoggato().then(res => {
      firebase.database().ref("Utente/" + res.getId()).update({ "callID": null });
    })

  }

  getCallId(usr) {
    return new Promise((resolve,reject) => {
      firebase.database().ref("Utente/" + usr).once("value", val => {
        resolve(val.val().callID)
      })
    })
  }
}
