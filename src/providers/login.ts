import {Injectable, NgZone} from "@angular/core";
import {OauthCordova} from "ng2-cordova-oauth/platform/cordova";
import * as firebase from "firebase";
import {Login} from "../login";
import {NavController, Events, ModalController} from "ionic-angular";
import {LoadingProvider} from "./loading";
import {AlertProvider} from "./alert";
import {AngularFireDatabase} from "angularfire2/database";
import {DataProvider} from "./data";
import {asYouType, format, getPhoneCode, parse} from "libphonenumber-js";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LineLogin } from '@ionic-native/line-login';
import { SettingPage } from "../pages/setting/setting";

declare var cordova: any;
@Injectable()
export class LoginProvider {
 
  private oauth: OauthCordova;
  private navCtrl: NavController;
  private phoneNumber = "";
  private password = "";

  constructor(
    public events: Events,
    private fb: Facebook,
    private lineLogin: LineLogin,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public zone: NgZone,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public modalCtrl: ModalController,
  ) {
    this.oauth = new OauthCordova();
    // Detect changes on the Firebase user and redirects the view depending on the user's status.
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     // Update userData on Database.
    //     // this.angularDb.object('/accounts/' + user.uid).update({
    //     //   isOnline: true
    //     // }).then((success) => {
    //     //
    //     // }).catch((error) => {
    //     //   //this.alertProvider.showErrorMessage('profile/error-update-profile');
    //     // });

    //     if (user["isAnonymous"]) {
    //       //Goto Trial Page.
    //       this.navCtrl.setRoot(Login.trialPage, { animate: false });
    //     } else {
    //       // this.diagnostic.setBluetoothState(true)
    //       // this.diagnostic.getBluetoothState()
    //       // .then((state) => {
    //       //   if (state == this.diagnostic.bluetoothState.POWERED_ON){
    //       //     alert('on')
    //       //     // do something
    //       //   } else {
    //       //     alert('off')
    //       //     // do something else
    //       //   }
    //       // }).catch(e => console.error(e));

    //       if (Login.emailVerification) {
    //         if (user["emailVerified"]) {
    //           //Goto Home Page.
    //           this.zone.run(() => {
    //             //this.navCtrl.setRoot(Login.homePage, { animate: false });
    //           });
    //           //Since we're using a TabsPage an NgZone is required.
    //         } else {
    //           //Goto Verification Page.
    //           // this.navCtrl.setRoot(Login.verificationPage, { animate: false });
    //           //this.navCtrl.setRoot(Login.homePage, { animate: false });
    //         }
    //       } else {
    //         //Goto Home Page.
    //         this.zone.run(() => {
    //          this.navCtrl.setRoot(Login.homePage, { animate: false });
    //         });
    //         //Since we're using a TabsPage an NgZone is required.
    //       }
    //     }
    //   }
    // });
  }

  // Hook this provider up with the navigationController.
  // This is important, so the provider can redirect the app to the views depending
  // on the status of the Firebase user.
  setNavController(navCtrl) {
    this.navCtrl = navCtrl;
  }

  // Facebook Login, after successful authentication, triggers firebase.auth().onAuthStateChanged((user) on top and
  // redirects the user to its respective views. Make sure to set your FacebookAppId on login.ts
  // and enabled Facebook Login on Firebase app authentication console.
  // facebookLogin(id, name) {
  facebookLogin() {

    this.fb.login(['email']).then( response => {

      // console.log("fb token("+response.authResponse.accessToken+")");
      // console.log(response);

      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      
      firebase.auth().signInWithCredential(facebookCredential)
        .then( success => { 

          console.log("Firebase success: " + JSON.stringify(success)); 
          this.loadingProvider.hide();
          this.createUserData();
      });
    }).catch((error) => { console.log(error) });
  }

  loginLine() {

    this.lineLogin.initialize({ channel_id: "1539150639" });

    this.lineLogin.login()
      .then(result => {

          // console.log("lineLogin ==> result");
          // console.log(result);
          // var displayName = result.displayName;
          
          var mail = result.userID + "@my.line.com";
          this.emailLogin(mail, "asdfaf2lkjasdf");
      })
      .catch(error => console.log("lineLogin ==> error(" + error +")" ))
  }

  // Anonymous Login, after successful authentication, triggers firebase.auth().onAuthStateChanged((user) on top and
  // redirects the user to its respective views. Make sure to enable Anonymous login on Firebase app authentication console.
  guestLogin() {
    this.loadingProvider.show();
    firebase
      .auth()
      .signInAnonymously()
      .then(success => {
        this.loadingProvider.hide();
        this.createUserData();
      })
      .catch(error => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Login on Firebase given the email and password.
  phoneLogin(email, password) {
    this.loadingProvider.show();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(success => {
        this.loadingProvider.hide();
        this.password = password;
        // this.countryCode = "+" + getPhoneCode(parse(password).country);
        this.createUserData();
      })
      .catch(error => {
        let code = error["code"];
        if (code == "auth/user-not-found") {
          this.register(email, password);
        } else {
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage(code);
        }
      });
  }

  // Login on Firebase given the email and password.
  emailLogin(email, password) {
    this.loadingProvider.show();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(success => {
        this.loadingProvider.hide();
        this.password = "";
        // this.countryCode = "";

        console.log("won test ==> emailLogin");
        this.createUserData();
      })
      .catch(error => {
        let code = error["code"];
        if (code == "auth/user-not-found") {
          this.register(email, password);
        } else {
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage(code);
        }
      });
  }

  // Register user on Firebase given the email and password.
  register(email, password) {
    this.loadingProvider.show();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(success => {
        this.loadingProvider.hide();
        this.password = password;
        // this.countryCode = "+" + getPhoneCode(parse(password).country);
        this.createUserData();
      })
      .catch(error => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Register user on Firebase given the email and password.
  emailRegister(email, password) {
    this.loadingProvider.show();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(success => {
        this.loadingProvider.hide();
        this.password = "";
        // this.countryCode = "";
        this.createUserData();
      })
      .catch(error => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Send Password Reset Email to the user.
  sendPasswordReset(email) {
    this.loadingProvider.show();
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(success => {
        this.loadingProvider.hide();
        this.alertProvider.showPasswordResetMessage(email);
      })
      .catch(error => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Create userData on the database if it doesn't exist yet.
  createUserData() {

    this.dataProvider.getMember(firebase.auth().currentUser.uid).take(1).subscribe(member => {

      firebase
      .database()
      .ref("accounts/" + firebase.auth().currentUser.uid)
      .once("value")
      .then(account => {

        // No database data yet, create user data on database
        if (!account.val()) {

          this.loadingProvider.show();
          let user = firebase.auth().currentUser;
          // console.log("won test ==> user");
          // console.log(user);
          var userId, name, provider, img, email, phoneNumber;
          let providerData = user.providerData[0];

          userId = user.uid;
          // console.log("won test ==> userId("+userId+")");

          var isFirstTime = true;
          if(member) {
            isFirstTime = (member.isFirstTime)? member.isFirstTime: false;
          }
          
          // Get name from Firebase user.
          if (user.displayName || providerData.displayName) {
            name = user.displayName;
            name = providerData.displayName;
          } else {
            // if (this.phoneNumber) {
            //   name = this.phoneNumber;
            // } else {
              name = "新使用者"; // user.email;
            // }
          }

          // Set default username based on name and userId.
          let username = name.replace(/ /g, "") + userId.substring(0, 8);

          // Get provider from Firebase user.
          if (providerData.providerId == "password") {
            provider = "Firebase";
          } else if (providerData.providerId == "facebook.com") {
            provider = "Facebook";
          } else if (providerData.providerId == "google.com") {
            provider = "Google";
          }

          // Get photoURL from Firebase user.
          if (user.photoURL || providerData.photoURL) {
            img = user.photoURL;
            img = providerData.photoURL;
          } else {
            img = "https://firebasestorage.googleapis.com/v0/b/so88-9ef61.appspot.com/o/profile.png?alt=media";
          }

          // Get email from Firebase user.
          email = user.email;
          // Set default description.
          let description = "你好，很高興認識你";
          let uniqueId = Math.floor(Math.random() * 10000000000);
          let tempData = {
            userId: userId,
            name: name,
            username: username,
            provider: provider,
            img: img,
            email: email,
            description: description,
            uniqueId: uniqueId,
            isOnline: true,
            dateCreated: new Date().toString(),
            phoneNumber: this.phoneNumber,
            password: this.password,
            isFirstTime: isFirstTime,
            // countryCode: this.countryCode
          };


          console.log("won test ==> tempData");
          console.log(tempData);

          // Insert data on our database using AngularFire.
          this.angularDb
            .object("/accounts/" + userId)
            .set(tempData)
            .then(() => {
              
              this.loadingProvider.hide();
              this.dataProvider.setData("userData", tempData);
            
              if(isFirstTime == true) {

                let profileModal = this.modalCtrl.create(SettingPage, { isFirstTime: true });
                profileModal.present();
              } else {
                this.navCtrl.setRoot(Login.homePage, { animate: false });
              }
            });

        } else {
          let _userData = account.val();
          if (_userData.userId) {
            this.angularDb
              .object("/accounts/" + _userData.userId)
              .update({
                isOnline: true
              })
              .then(success => {})
              .catch(error => {
                //this.alertProvider.showErrorMessage('profile/error-update-profile');
              });
          }
          if (!_userData.isBlock) {

            this.dataProvider.setData("userData", account.val());
            this.navCtrl.setRoot(Login.homePage, { animate: false });
            // let profileModal = this.modalCtrl.create(SettingPage, { isFirstTime: true });
            // profileModal.present();
          } else {
            this.alertProvider.showAlert(
              "Login Failed",
              "You are temporary block. please contact to ionSocial team "
            );
          }
        }

        this.events.publish("shareObject");
    });
    });


  }
}
