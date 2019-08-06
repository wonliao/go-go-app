import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Content} from 'ionic-angular';
import {FirebaseProvider} from '../../providers/firebase';
import {DataProvider} from '../../providers/data';
import * as firebase from 'firebase';

/**
 * Generated class for the CommentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  @ViewChild(Content) content: Content;

  private user: any;
  postKey;
  commentText;
  comments:any;
  private replyId: string; 
  private replyName: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public firebaseProvider:FirebaseProvider,
    public dataProvider : DataProvider) {
      this.postKey = this.navParams.get('postKey')
  }

  ionViewDidLoad() {

    this.replyId = "";
    this.replyName = "";

    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = user;
    });

    this.dataProvider.getComments(this.postKey).subscribe((comments)=>{

        this.comments = [];
        comments.forEach((comment)=>{

          if(comment.$exists()){
            
            let tempComment = comment;
            tempComment.replyList = [];

            let replys = comment.reply;
            for (let key in replys) {
              
              let reply = replys[key];
              reply.$key = key;
              // console.log(reply);
              tempComment.replyList.push(reply);
            }

            let tempData = <any>{};
            tempData = tempComment;
            this.comments.push(tempData);
          }
        })
    });

    let that = this;
    setTimeout(()=>{that.content.scrollToBottom();}, 1000); 
  }

  dismiss() {
    
      this.viewCtrl.dismiss();
  }

  postComment(){

    let comment = {
      dateCreated: new Date().toString(),
      postBy: this.user.userId,
      postName: this.user.username,
      postImg: this.user.img,
      commentText: this.commentText,
    }

    // 回覆留言
    if(this.replyId != "") {

      // console.log("postKey("+this.postKey+") replyId("+this.replyId+")");
      this.firebaseProvider.commentReply(this.postKey, this.replyId, comment).then((res)=>{

        this.replyId = "";
        this.addNotification();
      });
    // 留言
    } else {

      this.firebaseProvider.commentPost(this.postKey, comment).then((res)=>{

        this.addNotification();
      });
    }
  }

  replyComment(key:string, name:string) {

    // console.log("replyComment key ==>("+key+") name("+name+")");
    this.replyId = key;

    if(name == this.user.username) {
      this.replyName = "你";
    } else {
      this.replyName = name;
    } 
  }

  addNotification() {

    this.commentText  = '';

    this.dataProvider.getTimeline(this.postKey).subscribe((timeline) => {

      if (timeline.$exists()) {

        let postBy = timeline.postBy;

        // 當別人留言才新增一筆通知
        if(postBy != firebase.auth().currentUser.uid) {

          var date = new Date();
          var timeStarts = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
            .toISOString()
            .split(".")[0];

          var notificationData = { 
            type: "comment",
            timelineId: this.postKey,
            isRead: false,
            dateCreated: timeStarts,
            fromUserId: firebase.auth().currentUser.uid
          };
          // 新增一筆通知
          this.dataProvider.updateNotification(postBy, notificationData);
        }
      }
    });
  }
  
  removeComment(key:string, subKey:string) {

    // console.log("removeComment 1 ==> postKey("+this.postKey+") key("+key+") subKey("+subKey+")");
    // console.log(subKey);
    this.firebaseProvider.removeComment(this.postKey, key, subKey);
  }

  closeModal() {

    this.viewCtrl.dismiss();
  }
  


}
