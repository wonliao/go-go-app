import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Events } from 'ionic-angular';

//Pages
import { PrivacyPage } from '../privacy/privacy';
import { PaymentRecordPage } from '../payment-record/payment-record';
import { ShopPage } from '../shop/shop';
import { BroadcastPage } from '../broadcast/broadcast';
import { TermsPage } from '../terms/terms';
// import { ContactPage } from '../contact/contact';
import { LogoutBlankPage } from '../logout-blank/logout-blank';
import { MessagesPage } from '../messages/messages';
// import { GroupsPage } from '../groups/groups';
// import { FriendsPage } from '../friends/friends';
// import { HomePage } from '../home/home';
import { PrivatePage } from '../private/private';

import { DataProvider } from '../../providers/data';
import { LogoutProvider } from '../../providers/logout';


/**
 * Generated class for the SideMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-side-menu',
  templateUrl: 'side-menu.html',
})
export class SideMenuPage {

  constructor(
    public events: Events,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public logoutProvider: LogoutProvider,) {


  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SideMenuPage');
  }

  openPage(selectIndex) {

    // 選擇 Tabs
    // this.nav.getActiveChildNav().select(pageIndex);


    var pages = [
      // HomePage,           // 個人資料
      PaymentRecordPage,  // 付款紀錄
      ShopPage,           // 購買計畫
      PrivatePage,        // 隱私設定
      BroadcastPage,      // 推播設定
      TermsPage,          // 使用條款
      PrivacyPage,        // 隱私權政策
      MessagesPage, //ContactPage,        // 聯絡我們
      // MessagesPage,       // 聊天
      // GroupsPage,         // 社團
      // FriendsPage,        // 好友
    ];

    if(pages[selectIndex] == MessagesPage) {
      console.log("gotoChats ==>");
      this.events.publish("gotoChats");
      this.viewCtrl.dismiss();
    } else {
      const modal = this.modalCtrl.create(pages[selectIndex]);
      modal.present();
    }

  }

  logout() {

    this.logoutProvider.logout().then(res => {

      this.dataProvider.clearData();
      // this.nav.setRoot(LoginPage);
      this.navCtrl.setRoot(LogoutBlankPage).then(() => {

        setTimeout(function () {
          window.location.reload();
        }, 1000);
      });
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
