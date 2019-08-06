import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ActionSheetController, ViewController, Events } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { FirebaseProvider } from '../../providers/firebase';
import { ImageProvider } from '../../providers/image';
import { AlertProvider } from '../../providers/alert';

declare var google: any;

/**
 * Generated class for the AddPostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  private user: any;
  private postType: string;
  private action: string;
  private postData: any;
  private groupId: string;

  public postTypeTitle: string;

  public foodName: string;      // 食物名
  public timeStarts: string;    // 時間
  public weight: string;        // 體重
  public menstruation: boolean; // 月經
  public postText;              // 照片說明
  public shareType;             // 分享對象

  public shareTypeText: string;
  public alert;
  public image;
  public location;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public dataProvider: DataProvider,
    public angularDb: AngularFireDatabase,
    public firebaseProvider: FirebaseProvider,
    public alertCtrl: AlertController,
    public imageProvider: ImageProvider,
    public alertProvider: AlertProvider,
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,
    ) {

    this.postType = this.navParams.get('paramType');
    this.action = this.navParams.get('action');
    this.groupId = this.navParams.get('groupId');
    this.postData = this.navParams.get('postData');
    // console.log("postData");
    // console.log(this.postData);

    this.postTypeTitle = "";
    if (this.postType == 'post') this.postTypeTitle = "發表貼文";
    else if (this.postType == 'food') this.postTypeTitle = "紀錄飲食";
    else if (this.postType == 'body') this.postTypeTitle = "紀錄身體";
    // console.log("type(" + this.postType + ") title(" + this.postTypeTitle + ")");

    // 修改
    if(this.action == "edit") {

      // 設定預設值
      this.image = this.postData.image;
      this.postText = this.postData.postText;
      this.foodName = this.postData.foodName;
      this.weight = this.postData.weight;
      this.shareType = this.postData.shareType;
      if(this.shareType == "tracker") {
        this.shareTypeText = "追蹤我的人";
      } else if(this.shareType == "me") {
        this.shareTypeText = "只限本人";
      } else {
        this.shareTypeText = "僅限專家(醫生、營養師、健身教練)";
      }
    // 新增
    } else {

      // 設定預設值
      this.postText = "";
      this.foodName = "";
      this.weight = "";
      this.shareType = "expert";
      this.shareTypeText = "僅限專家(醫生、營養師、健身教練)";
    }

    this.menstruation = false;
    var date = new Date();
    this.timeStarts = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split(".")[0];
    // console.log("timeStarts:" + this.timeStarts);
  }

  ionViewDidLoad() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.loadingProvider.hide();
      this.user = user;
    });
  }

  postClick() {

    console.log("postClick ==> " + this.action);
    // 修改
    if(this.action == "edit") {
      this.edit();
    // 新增
    } else {
      this.post();
    }
  }

  // 修改貼文
  edit() {

    // 是否需要上傳圖
    var uploadFlag = false;
    if(this.image != this.postData.image) {
      uploadFlag = true;
    }
    console.log("uploadFlag("+uploadFlag+")");

    // 需上傳圖片
    if (uploadFlag) {

      if (this.image) {

        this.loadingProvider.show();
        this.imageProvider.uploadPostImage(this.image).then((url) => {

          let timelineId = this.postData.$key;
         
          var dateCreated = new Date(this.timeStarts).toISOString();
          this.angularDb
          .object('/timeline/' + timelineId)
          .update({
            postType: this.postType,
            dateCreated: dateCreated,
            postBy: this.user.phoneNumber,
            userId: this.user.userId,
            postText: this.postText,
            shareType: this.shareType,
            weight: this.weight,
            menstruation: this.menstruation,
            foodName: this.foodName,
            image: url
          })
          .then(success => {

            var temp = {
              dateCreated: dateCreated,
              weight: this.weight, 
            }
            this.firebaseProvider.timeline(timelineId, temp);
            this.alertProvider.showToast('修改成功');
            this.loadingProvider.hide();


            // 恢復預設值
            this.image = '';
            this.postText = '';
            this.shareType = '';
            this.weight = '';
            this.foodName = '',
            this.menstruation = false;

            this.navCtrl.pop();
          })
          .catch(error => {
            console.log(error);
          });
        });
      }
    } else {

      this.loadingProvider.show();
      let timelineId = this.postData.$key;
      console.log("timelineId("+timelineId+")");

      var dateCreated = new Date(this.timeStarts).toISOString();
      this.angularDb
      .object('/timeline/' + timelineId)
      .update({
        postType: this.postType,
        dateCreated: dateCreated,
        postBy: this.user.phoneNumber,
        userId: this.user.userId,
        postText: this.postText,
        shareType: this.shareType,
        weight: this.weight,
        menstruation: this.menstruation,
        foodName: this.foodName,
        // image: url
      })
      .then(success => {

        var temp = {
          dateCreated: dateCreated,
          weight: this.weight, 
        }
        this.firebaseProvider.timeline(timelineId, temp);

        this.alertProvider.showToast('修改成功');
        this.loadingProvider.hide();

        // 恢復預設值
        this.image = '';
        this.postText = '';
        this.shareType = '';
        this.weight = '';
        this.foodName = '',
        this.menstruation = false;

        this.navCtrl.pop();
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  // 新增貼文
  post() {

    this.loadingProvider.show();

    // 需上傳圖片
    if (this.image) {
      
      let that = this;
      this.imageProvider.uploadPostImage(this.image).then((url) => {

        that.pushNewPostInTimeline(url);
      });
    // 無圖片
    } else {

      this.pushNewPostInTimeline("");
    }
  }

  pushNewPostInTimeline(url) {

    var dateCreated = new Date(this.timeStarts).toISOString();
    this.angularDb.list('timeline').push({
      postType: this.postType,
      dateCreated: dateCreated,
      postBy: this.user.phoneNumber,
      userId: this.user.userId,
      postText: this.postText,
      shareType: this.shareType,
      weight: this.weight,
      menstruation: this.menstruation,
      foodName: this.foodName,
      image: url
    }).then((success) => {
      
      var temp = {
        dateCreated: dateCreated,
        weight: this.weight
      }
      let timelineId = success.key;
      this.firebaseProvider.timeline(timelineId, temp);

       // 社團 Timeline
      if(this.groupId != undefined) {

        // console.log("社團 Timeline");
        var temp3 = {
          postBy: this.user.phoneNumber,
          dateCreated: dateCreated,
          timelineId: timelineId,
        };
        this.angularDb.object('/groups/' + this.groupId + '/timeline/' + timelineId).update(temp3).then(() => {
          // 更新 Timeline
          this.events.publish("refreshTimeline");
        });
      // 加到綁定帳號
      } else {

        var temp2 = {
          postBy: this.user.phoneNumber,
          dateCreated: dateCreated,
          weight: this.weight,
        };  
        this.dataProvider.addTimelineToAccount(this.user, timelineId, temp2, true);
      }

      this.alertProvider.showToast('上傳成功');
      this.loadingProvider.hide();

      this.updateNotification(timelineId, this.postType);

    

      // 恢復預設值
      this.image = '';
      this.postText = '';
      this.shareType = '';
      this.weight = '';
      this.foodName = '',
      this.menstruation = false;

      this.navCtrl.pop();
    });
  }

  imageShare() {
    this.imageProvider.setImage().then((url) => {
      this.image = url;
    })
  }

  changeShareType() {
    // console.log("changeShareType push");
    let actionSheet = this.actionSheetCtrl.create({
      title: "分享對象",
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

  dateChanged(event) {

    // console.log(event.value);
    this.timeStarts = event.value;
  }
  
  updateNotification(timelineId, postType) {

    if(postType != 'food')  return;

    // 找出指導營養師
    this.dataProvider.getSubscription(firebase.auth().currentUser.uid)
      .subscribe((subscription) => {
        
        if(subscription.$exists()){

          var expectId = subscription.expectId;
          var date = new Date();
          var timeStarts = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .split(".")[0];
      
          var notificationData = { 
            type: "foodPost",
            timelineId: timelineId,
            isRead: false,
            dateCreated: timeStarts,
            fromUserId: firebase.auth().currentUser.uid
          };
          // 新增一筆通知
          this.dataProvider.updateNotification(expectId, notificationData);
        }
    });
  }
  
  closeModal() {
    console.log("closeModal ==>");
    this.viewCtrl.dismiss();
  }
}
