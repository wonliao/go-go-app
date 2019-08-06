import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController } from 'ionic-angular';

/**
 * Generated class for the PrivatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-private',
  templateUrl: 'private.html',
})
export class PrivatePage {

  private shareType;             // 分享對象
  private shareTypeText: string;

  private status: string        // 帳號分開/不公開
  private statusText: string;

  constructor(
    public navCtrl: NavController, 
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {


    if(this.shareType == "tracker") {
      this.shareTypeText = "追蹤我的人";
    } else if(this.shareType == "me") {
      this.shareTypeText = "只限本人";
    } else {
      this.shareTypeText = "僅限專家(醫生、營養師、健身教練)";
    }

    this.statusText = "公開";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivatePage');
  }

  changeShareType() {
    // console.log("changeShareType push");
    let actionSheet = this.actionSheetCtrl.create({
      title: "貼文設定",
      buttons: [
        {
          text: "僅限專家(醫生、營養師、健身教練)",
          role: "expert",
          handler: () => {
            this.shareType = "expert";
            this.shareTypeText = "僅限專家(醫生、營養師、健身教練)";
            // console.log(this.shareType);
          }
        },
        {
          text: "追蹤我的人",
          role: "tracker",
          handler: () => {
            this.shareType = "tracker";
            this.shareTypeText = "追蹤我的人";
            // console.log(this.shareType);
          }
        },
        {
          text: "只限本人",
          role: "me",
          handler: () => {
            this.shareType = "me";
            this.shareTypeText = "只限本人";
            // console.log(this.shareType);
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            // console.log("Cancel clicked");
          }
        }
      ]
    });

    actionSheet.present();
  }

  changeStatus() {
    // console.log("changeShareType push");
    let actionSheet = this.actionSheetCtrl.create({
      title: "帳號狀態",
      buttons: [
        {
          text: "公開",
          role: "public",
          handler: () => {
            this.status = "public";
            this.statusText = "公開";
          }
        },
        {
          text: "不公開",
          role: "private",
          handler: () => {
            this.status = "private";
            this.statusText = "不公開";
            // console.log(this.shareType);
          }
        },
        {
          text: "取消",
          role: "取消",
          handler: () => {
            // console.log("Cancel clicked");
          }
        }
      ]
    });

    actionSheet.present();
  }

  closeModal() {
    console.log("closeModal ==>");
    this.viewCtrl.dismiss();
  }
}
