import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from '../../validator';
import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push';
// import { AlertProvider } from '../../providers/alert';


declare var AccountKitPlugin;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private mode: string;
  private emailPasswordForm: FormGroup;
  private emailForm: FormGroup;
  // LoginPage
  // This is the page where the user can register and login to our app.
  // It's important to initialize the loginProvider here and setNavController as it will direct the routes of our app.
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public loginProvider: LoginProvider,
    private iab: InAppBrowser,
    // private codePush: CodePush,
    // public alertProvider: AlertProvider,
    public formBuilder: FormBuilder) {


    platform.ready().then(() => {

      // this.checkSync();
    });

    this.loginProvider.setNavController(this.navCtrl);
    
    this.emailPasswordForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validator.passwordValidator
    });
    this.emailForm = formBuilder.group({
      email: Validator.emailValidator
    });
  }

  ionViewDidLoad() {
    // Set view mode to main.
    this.mode = 'main';

  }

  // checkSync() {

  //   this.codePush.sync({
  //       updateDialog: {
  //         updateTitle: "更新提示",
  //         optionalUpdateMessage: "已經有新版本可以安裝了",
  //         optionalInstallButtonLabel: "安裝",
  //         optionalIgnoreButtonLabel: "下次再說",
  //         appendReleaseDescription: true,
  //         descriptionPrefix: "\n\n更新說明:\n"   
  //       },
  //       installMode: InstallMode.IMMEDIATE
  //   }).subscribe(
  //     (data) => {

  //       console.log('CODE PUSH SUCCESSFUL: ' + data);
  //       this.alertProvider.showToast('CODE PUSH SUCCESSFUL: ' + data);
  //     },
  //     (err) => {

  //       console.log('CODE PUSH ERROR: ' + err);
  //       this.alertProvider.showToast('CODE PUSH ERROR: ' + err);
  //     }
  //   );
  // }


  // Call loginProvider and login the user with email and password.
  // You may be wondering where the login function for Facebook and Google are.
  // They are called directly from the html markup via loginProvider.facebookLogin() and loginProvider.googleLogin().
  loginWithPhone() {
    //this.loginProvider.emailLogin(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]);
    // FacebookAccountKit.mobileLogin(function (response) { alert(JSON.stringify(response)); }, function (error) { console.log(error) });
    let options = {
      useAccessToken: true,
      defaultCountryCode: "IN",
      facebookNotificationsEnabled: true,
    }
    AccountKitPlugin.loginWithPhoneNumber(options, ((res) => {
      AccountKitPlugin.getAccount((res1) => {
        console.log('phoneEmail', res1.phoneNumber)
        var phoneEmail = res1.phoneNumber.toString() + '@gmail.com';
        var pass = res1.phoneNumber;
        this.loginProvider.phoneLogin(phoneEmail, pass);
      })
    }), ((err) => {
      alert('err')
    }))
  }

  // Call loginProvider and register the user with email and password.
  register() {
    this.loginProvider.emailRegister(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]);
  }

  login() {
    this.loginProvider.emailLogin(this.emailPasswordForm.value["email"], this.emailPasswordForm.value["password"]);

  }

  // Call loginProvider and send a password reset email.
  forgotPassword() {
    this.loginProvider.sendPasswordReset(this.emailForm.value["email"]);
    this.clearForms();
  }

  // Clear the forms.
  clearForms() {
    this.emailPasswordForm.reset();
    this.emailForm.reset();
  }

  termcondition() {
    console.log("termcondition")
    const browser = this.iab.create('https://www.worlddove.com/documents/eula.pdf');
  }
}
