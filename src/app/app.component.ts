import { Component, ViewChild } from '@angular/core';
import { App, Nav, Events, ModalController, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { AngularFireDatabase } from 'angularfire2/database';

//Pages
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { PrivacyPage } from '../pages/privacy/privacy';
import { PaymentRecordPage } from '../pages/payment-record/payment-record';
import { ShopPage } from '../pages/shop/shop';
import { BroadcastPage } from '../pages/broadcast/broadcast';
import { TermsPage } from '../pages/terms/terms';
import { ContactPage } from '../pages/contact/contact';
import { LogoutBlankPage } from '../pages/logout-blank/logout-blank';
import { MessagesPage } from '../pages/messages/messages';

// Provider
import { SettingsProvider } from '../providers/settings/settings';
import { DataProvider } from '../providers/data';
import { LogoutProvider } from '../providers/logout';
import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';
import { HomePage } from '../pages/home/home';

import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push';
import { AlertProvider } from '../providers/alert';
import { SettingPage } from '../pages/setting/setting';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  userData: any;
  settings: any = null;

  @ViewChild(Nav) nav: Nav;

  constructor(
    platform: Platform,
    public app: App,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    keyboard: Keyboard,
    public modalCtrl: ModalController,
    public events: Events,
    public angularDb: AngularFireDatabase,
    public settingsProvider: SettingsProvider,
    public menuCtrl: MenuController,
    public logoutProvider: LogoutProvider,
    private codePush: CodePush,
    public alertProvider: AlertProvider,
    public dataProvider: DataProvider) {

    this.settingsProvider.getSettings().then(data => {
      this.settings = data;
      // console.log(this.settings);
    })

    this.events.subscribe('settings_change: change', (data) => {
      this.settings = data;
    });

    events.subscribe('shareObject', () => {
      console.log("shareObject");
      this.reloadData();
    }); 

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      if(platform.is('android')) {
        statusBar.backgroundColorByHexString('#fafafa');
      }

      splashScreen.hide();

      this.checkSync();

      // this.events.subscribe('openVideocall', () => {
      //   let profileModal = this.modalCtrl.create(VideoCallPage);
      //   profileModal.present();
      // })
   
      this.dataProvider.getData('userData').then((data2) => {
        
        if (data2) {
          console.log(data2);
          this.dataProvider.getUser(data2.userId).subscribe((data) => {

            let userData = <any>data;
            this.userData = userData;
            if (userData) {
              
              let _userData = <any>userData;
              
              this.angularDb.object('/accounts/' + _userData.userId)
              .update({
                isOnline: true
              }).then((success) => {
                
                console.log(this.userData);
                if(this.userData.isFirstTime == true) {
                  
                  let profileModal = this.modalCtrl.create(SettingPage, { isFirstTime: true });
                  profileModal.present();
                } else {

                  this.rootPage = TabsPage;
                }
              }).catch((error) => {

                this.rootPage = LoginPage;
              });
            } else {
              
              this.rootPage = LoginPage
            }
          });
        } else {

          this.rootPage = LoginPage
        }
      });
    });
  }

  checkSync() {

    this.codePush.sync({
        updateDialog: {
          updateTitle: "更新提示",
          optionalUpdateMessage: "已經有新版本可以安裝了",
          optionalInstallButtonLabel: "安裝",
          optionalIgnoreButtonLabel: "下次再說",
          appendReleaseDescription: true,
          descriptionPrefix: "\n\n更新說明:\n"   
        },
        installMode: InstallMode.IMMEDIATE
    }).subscribe(
      (data) => {

        console.log('CODE PUSH SUCCESSFUL: ' + data);
        this.alertProvider.showToast('CODE PUSH SUCCESSFUL: ' + data);
      },
      (err) => {

        console.log('CODE PUSH ERROR: ' + err);
        this.alertProvider.showToast('CODE PUSH ERROR: ' + err);
      }
    );
  }


  openPage(selectIndex) {

    var pages = [
      HomePage,           // 個人資料
      PaymentRecordPage,  // 付款紀錄
      ShopPage,           // 購買計畫
      BroadcastPage,      // 推播設定
      TermsPage,          // 使用條款
      PrivacyPage,        // 隱私權政策
      ContactPage,        // 聯絡我們
      MessagesPage,       // 聊天
      GroupsPage,         // 社團
      FriendsPage,        // 好友
    ];

    this.nav.push(pages[selectIndex]);

    // 關閉 Side Menu
    this.menuCtrl.close();
  }

  logout() {

    this.logoutProvider.logout().then(res => {

      // 關閉 Side Menu
      this.menuCtrl.close();

      this.dataProvider.clearData();
      // this.nav.setRoot(LoginPage);
      this.nav.setRoot(LogoutBlankPage).then(() => {

        setTimeout(function () {
          window.location.reload();
        }, 1000);
      });
    });
  }

  public reloadData() {

    this.dataProvider.getData('userData').then((data) => {
      let userData = <any>data;
      this.userData = userData;
    })
  }
}
