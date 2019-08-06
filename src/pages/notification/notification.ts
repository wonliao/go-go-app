import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data';
import {LoadingProvider} from '../../providers/loading';
// import {AlertProvider} from '../../providers/alert';
// import {FirebaseProvider} from '../../providers/firebase';
import {AngularFireDatabase} from 'angularfire2/database';
// import {UserInfoPage} from '../user-info/user-info';
import * as firebase from "firebase";
import { TimelinePage } from '../timeline/timeline';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  private user: any;
  notifications: any;
  
  constructor(
    public navCtrl: NavController, 
    public dataProvider: DataProvider, 
    public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController, 
    public angularDb:AngularFireDatabase, 
    // public alertProvider: AlertProvider, 
    // public firebaseProvider: FirebaseProvider
    ) { 

    }

  ionViewDidLoad() {
 
    this.loadingProvider.show();
 
    this.dataProvider.getCurrentUser().subscribe(user => {

      this.user = user;

      this.dataProvider.getNotification(this.user.phoneNumber)
      .subscribe((results) => {
        
        this.loadingProvider.hide();

        this.notifications = [];
        results.forEach((notification)=>{

          if(notification.$exists()){

            let tempNotification = notification;
            let tempData = <any>{};
            tempData = tempNotification;
            
            // 留言
            if(tempData.type == "comment") {
              tempData.message = "在你的照片留言";
            // 食物貼文
            } else if(tempData.type == "foodPost") {
              tempData.message = "上傳了食物";
            }

            // console.log("fromUserId("+tempNotification.fromUserId+")");

            this.dataProvider.getUser(tempNotification.fromUserId).subscribe((user) => {
              tempData.avatar = user.img;
              tempData.name = user.username;

              this.dataProvider.getTimeline(tempNotification.timelineId).subscribe((timeline) => {
                // console.log(timeline);
                tempData.image = timeline.image;

                this.notifications.push(tempData);
              });
            });
          }
        });

        // this.notifications = this.notifications.reverse();
      });
    });
  }

  gotoTimeline(post) {

    this.angularDb
    .object("/notification/" + this.user.phoneNumber + "/" + post.$key)
    .update({
      isRead: true
    });

    this.navCtrl.push(TimelinePage, {
      timelineId: post.timelineId
    });
  }

}
