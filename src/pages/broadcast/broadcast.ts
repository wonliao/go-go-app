import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController } from 'ionic-angular';

/**
 * Generated class for the BroadcastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-broadcast',
  templateUrl: 'broadcast.html',
})
export class BroadcastPage {

  private broadcastTime;             // 推播時間
  private broadcastTimeText: string;

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  constructor(
    public navCtrl: NavController, 
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

      this.broadcastTimeText = "公開";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BroadcastPage');
  }

  // changeStatus() {
  //   // console.log("changeShareType push");
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: "帳號狀態",
  //     buttons: [
  //       {
  //         text: "公開",
  //         role: "public",
  //         handler: () => {
  //           this.status = "public";
  //           this.statusText = "公開";
  //         }
  //       },
  //       {
  //         text: "不公開",
  //         role: "private",
  //         handler: () => {
  //           this.status = "private";
  //           this.statusText = "不公開";
  //           // console.log(this.shareType);
  //         }
  //       },
  //       {
  //         text: "取消",
  //         role: "取消",
  //         handler: () => {
  //           // console.log("Cancel clicked");
  //         }
  //       }
  //     ]
  //   });

  //   actionSheet.present();
  // }

  closeModal() {
    console.log("closeModal ==>");
    this.viewCtrl.dismiss();
  }
}
