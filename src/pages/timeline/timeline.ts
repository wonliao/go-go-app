import { Component, ViewChild } from "@angular/core";
import { ActionSheetController, AlertController, IonicPage, ModalController, NavController, NavParams, Platform, FabContainer, Events } from "ionic-angular";
import { AddPostPage } from "../add-post/add-post";
import { LoadingProvider } from "../../providers/loading";
import { DataProvider } from "../../providers/data";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase";
import { FirebaseProvider } from "../../providers/firebase";
import * as _ from "lodash";
import { CommentsPage } from "../comments/comments";
import { ImageModalPage } from "../image-modal/image-modal";
import { AlertProvider } from "../../providers/alert";
import { UpdateContactPage } from "../update-contact/update-contact";
import { LoginPage } from "../login/login";
import { LogoutProvider } from "../../providers/logout";
import { CaloriesPage } from "../calories/calories";
import { MessagesPage } from '../messages/messages';

var moment = require('moment');

declare var AccountKitPlugin: any;

/**
 * Generated class for the TimelinePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-timeline",
  templateUrl: "timeline.html"
})
export class TimelinePage {
  
  private user: any;
  public timelineData: any = [];
  public friendsList: any;
  private timelineId: string = "";
  private groupId: string = "";
  private groupName: string = "";
  // private isFirstTime: boolean;
  private lastTimelineKey: string = "";

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public firebaseProvider: FirebaseProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public alertProvider: AlertProvider,
    public logoutProvider: LogoutProvider,
    public platform: Platform
  ) {

    events.subscribe("refreshTimeline", () => {

      console.log("refreshTimeline ==>");
      this.timelineData = [];
      this.lastTimelineKey = "";

      this.getTimeline();
    });


    this.timelineId = "";
    if(this.navParams.get('timelineId')) {
      this.timelineId = this.navParams.get('timelineId');
    }

    this.groupId = "";
    if(this.navParams.get('groupId')) {
      this.groupId = this.navParams.get('groupId');
      this.groupName = this.navParams.get('groupName');
      console.log("groupId("+this.groupId+") groupName("+this.groupName+")");
    }
    
    // console.log("timelineId("+this.timelineId+")");

    this.platform.ready().then(() => {
      this.platform.pause.subscribe(() => {
        // this.isFirstTime = false;
        if (this.user.userId) {
          // Update userData on Database.
          this.angularDb
            .object("/accounts/" + this.user.userId)
            .update({
              isOnline: false
            })
            .then(success => { })
            .catch(error => {
              //this.alertProvider.showErrorMessage('profile/error-update-profile');
            });
        }
      });

      // 帳號綁定
      if(this.timelineId == "" && this.groupId == "" ) {

        this.dataProvider.getCurrentUser().take(1).subscribe((user) => {
        // this.dataProvider.getData('userData').then((user) => {

          this.user = user;
          // console.log("won test ==> phoneNumber("+this.user.phoneNumber+")");
  
          if (this.user.phoneNumber == "" || typeof(this.user.phoneNumber) == 'undefined') {
  
            let modal = this.modalCtrl.create(UpdateContactPage, {
              userData: user
            });
            modal.present();
          }
        });
      }
    });
  }

  ionViewDidLoad() {

    console.log("ionViewDidLoad ==>");

    // this.isFirstTime = true;
    
    let that = this;
    this.dataProvider.getCurrentUser().take(1).subscribe(user => {

      that.user = user;

      if (that.user.isBlock) {

        that.logoutProvider.logout().then(res => {
          that.dataProvider.clearData();
          AccountKitPlugin.logout();
          that.navCtrl.parent.parent.setRoot(LoginPage);
          that.alertProvider.showToast("You are temporary blocked.");
        });
      } else {

        console.log("ionViewDidLoad 2 ==>");
        that.getTimeline();
      }
    });
  }

  ionViewWillEnter() {

    if(this.groupId != "") {
      document.getElementById("fab").style.display = 'none';
      document.getElementById("groupFab").style.display = 'inherit';
    } 
  }

  ionViewWillLeave() {
   
    if(this.groupId != "") {
      document.getElementById("fab").style.display = 'inherit';
      document.getElementById("groupFab").style.display = 'none';
    }
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {

      this.getTimeline();

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  getTimeline() {
 
    console.log("getTimeline ==>");

    // 全部的貼文
    if(this.timelineId == "" && this.groupId == "") {
      
      this.dataProvider.getMyTimelinePost(this.user.phoneNumber, this.lastTimelineKey).take(1).subscribe(posts => {
        
        console.log("posts ==> length("+posts.length+")");
        console.log(posts);

        if(posts.length > 0) {

          console.log("won test 1 ==> this.lastTimelineKey("+this.lastTimelineKey+")");
          if(this.lastTimelineKey != "") {
            posts.shift();
          }

          let last = posts.length;
          console.log("last("+last+")");
          if(last > 0) {
            this.lastTimelineKey = posts[last-1].timelineId;
            console.log("won test 2 ==> this.lastTimelineKey("+this.lastTimelineKey+")");
          }
        }

        this.showTimelineCard(null, null, posts);
      });
    // 取社團貼文
    } else if(this.groupId != "") {

      this.dataProvider.getGroupTimelinePost(this.groupId, this.lastTimelineKey).take(1).subscribe(posts => {

        console.log("posts ==> length("+posts.length+")");
        console.log(posts);

        if(posts.length > 0) {

          console.log("won test 1 ==> this.lastTimelineKey("+this.lastTimelineKey+")");
          if(this.lastTimelineKey != "") {
            posts.shift();
          }

          let last = posts.length;
          console.log("last("+last+")");
          if(last > 0) {
            this.lastTimelineKey = posts[last-1].timelineId;
            console.log("won test 2 ==> this.lastTimelineKey("+this.lastTimelineKey+")");
          }
        }

        this.showTimelineCard(null, null, posts);
      });
      // 指定貼文
    } else if(this.timelineId != "") {
    
      this.dataProvider.getTimeline(this.timelineId).take(1).subscribe(post => {
        
        var posts = Array(post);
        this.showTimelineCard(null, null, posts);
      });
    }

      // subscription.unsubscribe();
    // });

    // // TODO: 需優化，只取必要的貼文
    // // 取出專家列表
    // this.dataProvider.getExpertList().subscribe((experts) => {

    //   // 取出好友列表
    //   this.dataProvider.getFriends().subscribe(friends => {

    //     if(this.timelineId == undefined) {

    //       // 取出全部的貼文
    //       this.dataProvider.getTimelinePost().subscribe(posts => {

    //         this.showTimelineCard(experts, friends, posts);
    //       });
    //     } else {
          
    //       // 取單篇貼文
    //       this.dataProvider.getTimeline(this.timelineId).subscribe(post => {
            
    //         var posts = Array(post);
    //         this.showTimelineCard(experts, friends, posts);
    //       });
    //     }
    //   });
    // });

  }

  showTimelineCard(experts:any, friends:any, post:any) {

    // this.timelineData = [];
    post.forEach(data => {

      // console.log(data.$key);
      this.dataProvider.getTimeline(data.$key).take(1).subscribe(timeline => {

        if (timeline.$exists()) {
          
          // console.log(timeline);
          let tempData = <any>{};
          tempData = timeline;
          
          tempData.isSelf = false;
          if(timeline.postBy == this.user.phoneNumber)  tempData.isSelf = true;

          // let expertIndex = _.findKey(experts, data => {
          //   let _tempData = <any>data;
          //   return _tempData.$value == timeline.postBy;
          // });

          // let friendIndex = _.findKey(friends, data => {
          //   let _tempData = <any>data;
          //   return _tempData.$value == timeline.postBy;
          // });

          // 個人貼文
          if (
            // expertIndex ||
            // friendIndex ||
            timeline.postBy == this.user.phoneNumber
          ) {

            
            this.dataProvider.getUser(timeline.userId).subscribe(user => {

              
              console.log(user);

              tempData.avatar = (user.img)? user.img: "https://firebasestorage.googleapis.com/v0/b/so88-9ef61.appspot.com/o/profile.png?alt=media";
              tempData.username = user.username;
              tempData.isExpert = user.isExpert;

              // 計算 BMI
              if (timeline.weight > 0) {

                // TODO：之後需加入會員身高
                var tall = (this.user.height)? this.user.height: 170;
                // console.log("won test ==> tall("+tall+")");
                tempData.bmi = Math.round(timeline.weight / ((tall / 100) * (tall / 100)) * 10) / 10;
                // console.log("won test ==> bmi("+ tempData.bmi+")")
              }
            });

            // 專家評量
            {
              // 蛋白質
              tempData.protein = timeline.protein;
              // 醣類
              tempData.fat = timeline.fat;
              // 脂肪
              tempData.carbohydrate = timeline.carbohydrate;
            }

            // 轉換時間
            {
              // var date = new Date(timeline.dateCreated);
              // var timeStarts = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
              //   .toISOString()
              //   .split(".")[0];

              // var timeStarts = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
              moment.locale();
              var formattedDate = moment(timeline.dateCreated).format('YYYY.MM.DD H:mm');
                
              // console.log("formattedDate ==>");
              // console.log(formattedDate);

              tempData.dateCreated = formattedDate;              // 時間
            }

            // 顯示 貼文/綜合/文字/體重
            tempData.showType = "post";
            if(timeline.postText && !timeline.weight && !timeline.image) {
              tempData.showType = "text";
            } else if (timeline.weight) {
              tempData.showType = "weight";
            } 
            // console.log("timelineId(" + tempData.$key + ") showType(" + tempData.showType + ")");

            //  ===== check like
            this.dataProvider.getLike(tempData.$key).subscribe(likes => {
              tempData.likes = likes.length;
              // Check post like or not
              let isLike = _.findKey(likes, like => {
                let _tempLike = <any>like;
                return (
                  _tempLike.$value == firebase.auth().currentUser.uid
                );
              });

              if (isLike) {
                tempData.isLike = true;
              } else {
                tempData.isLike = false;
              }
            });

            //  ===== check commnets
            this.dataProvider.getComments(tempData.$key).subscribe(comments => {

                // console.log(comments);
                tempData.comments = comments;
      
                // 留言數
                let count = 0;
                comments.forEach((comment)=>{
                  for (let key in comment.reply) {
                    count++;
                  }
                  count++;
                });
                tempData.commentsLength = count;

                // Check post like or not
                let isComments = _.findKey(comments, comment => {
                  let _tempComment = <any>comment;
                  return (
                    _tempComment.commentBy ==
                    firebase.auth().currentUser.uid
                  );
                });

                if (isComments) {
                  tempData.isComment = true;
                } else {
                  tempData.isComment = false;
                }
              });
        
              // this.timelineData.unshift(tempData);
              this.addOrUpdateTimeline(tempData);
          }
        }
      });
    });

    this.loadingProvider.hide();
  }

  // report to admin
  reportPost(item) {

    let actionSheet = this.actionSheetCtrl.create({
      // title: "Report post to admin",
      buttons: [
        {
          text: "編輯貼文",
          role: "expert",
          handler: () => {

            console.log(item);
        
            let profileModal = this.modalCtrl.create(AddPostPage, {
              paramType: item.postType, 
              action: 'edit',
              postData: item
            });
            profileModal.present();
          }
        },
        // {
        //   text: "編輯隱私設定",
        //   role: "tracker",
        //   handler: () => {
        //     console.log("編輯隱私設定", item);
        //     // this.loadingProvider.show();
        //   }
        // },
        {
          text: "刪除",
          role: "destructive",
          handler: () => {
            // console.log("刪除", item);
            this.alertCtrl.create({
              // title: '確認刪除',
              message: '是否要刪除此篇貼文?',
              buttons: [
                {
                  text: '取消'
                },
                {
                  text: '刪除',
                  handler: data => {
                    this.dataProvider.removePost(item);
                    this.alertProvider.showToast("刪除貼文成功");
                  }
                }
              ]
            }).present();
          }
        },
        {
          text: "取消",
          role: "cancel",
          handler: () => {
            // console.log("Cancel clicked");
          }
        }
      ]
    });

    actionSheet.present();
  }

  // Create userData on the database if it doesn't exist yet.
  // createUserData() {
  //   firebase
  //     .database()
  //     .ref("accounts/" + firebase.auth().currentUser.uid)
  //     .once("value")
  //     .then(account => {
  //       // No database data yet, create user data on database
  //       if (!account.val()) {
  //         this.loadingProvider.show();
  //         let user = firebase.auth().currentUser;
  //         var userId, name, provider, img, email, phoneNumber;
  //         let providerData = user.providerData[0];

  //         userId = user.uid;

  //         // Get name from Firebase user.
  //         if (user.displayName || providerData.displayName) {
  //           name = user.displayName;
  //           name = providerData.displayName;
  //         } else {
  //           name = "ionSocial User";
  //         }

  //         // Set default username based on name and userId.
  //         let username = name.replace(/ /g, "") + userId.substring(0, 8);

  //         // Get provider from Firebase user.
  //         if (providerData.providerId == "password") {
  //           provider = "Firebase";
  //         // } else if (providerData.providerId == "facebook.com") {
  //         //   provider = "Facebook";
  //         } else if (providerData.providerId == "google.com") {
  //           provider = "Google";
  //         }

  //         // Get photoURL from Firebase user.
  //         if (user.photoURL || providerData.photoURL) {
  //           img = user.photoURL;
  //           img = providerData.photoURL;
  //         } else {
  //           img = "https://firebasestorage.googleapis.com/v0/b/so88-9ef61.appspot.com/o/profile.png?alt=media";
  //         }

  //         // Get email from Firebase user.
  //         email = user.email;

  //         // Set default description.
  //         let description = "你好，很高興認識你";
  //         let uniqueId = Math.floor(Math.random() * 10000000000);
  //         let tempData = {
  //           userId: userId,
  //           name: name,
  //           username: username,
  //           provider: provider,
  //           img: img,
  //           email: email,
  //           description: description,
  //           uniqueId: uniqueId,
  //           isOnline: true,
  //           dateCreated: new Date().toString(),
  //           phoneNumber: ""
  //         };
  //         // Insert data on our database using AngularFire.
  //         this.angularDb
  //           .object("/accounts/" + userId)
  //           .set(tempData)
  //           .then(() => {
  //             this.loadingProvider.hide();
  //             //this.videoProvider.InitializingRTC(tempData);
  //             // if(!tempData.phonenumber){
  //             //     let alert = this.alertCtrl.create({
  //             //       title: 'Update your phone number',
  //             //       message: 'Please add your contact number',
  //             //       buttons: [
  //             //         {
  //             //           text: 'No'
  //             //         },
  //             //         {
  //             //           text: 'Yes',
  //             //           handler: data => {
  //             //                this.navCtrl.setRoot(HomePage);
  //             //           }
  //             //         }]
  //             //       }).present()
  //             // }
  //           });
  //       } else {
  //         //  if(this.user.phonenumber){
  //         //      this.alertCtrl.create({
  //         //       title: 'Update your phone number',
  //         //       message: 'Please add your contact number',
  //         //       buttons: [
  //         //         {
  //         //           text: 'No'
  //         //         },
  //         //         {
  //         //           text: 'Yes',
  //         //           handler: data => {
  //         //                this.navCtrl.setRoot(HomePage);
  //         //           }
  //         //         }]
  //         //       }).present()
  //         // }
  //         let isDt = true;
  //         if (isDt) {
  //           isDt = false;
  //           if (this.isFirstTime) {
  //             setTimeout(() => {
  //               //this.videoProvider.InitializingRTC(this.user);

  //               this.angularDb
  //                 .object("/accounts/" + this.user.userId)
  //                 .update({
  //                   isOnline: true
  //                 })
  //                 .then(success => { })
  //                 .catch(error => { });
  //             }, 500);
  //           }
  //         }

  //         // let isDt = true;
  //         // this.dataProvider.getCurrentUser().subscribe((user) => {
  //         //   this.user = <any>user;
  //         //   if(isDt){
  //         //      isDt = false;
  //         //      if(this.isFirstTime){
  //         //         setTimeout(()=>{
  //         //             this.videoProvider.InitializingRTC(this.user);
  //         //             this.angularDb.object('/accounts/' + this.user.userId).update({
  //         //               isOnline: true
  //         //             }).then((success) => {

  //         //             }).catch((error) => {
  //         //               //this.alertProvider.showErrorMessage('profile/error-update-profile');
  //         //             });
  //         //         },500)

  //         //       }
  //         //   }
  //         // });
  //       }
  //     });
  // }

  // Add or update timeline data for real-time sync.
  addOrUpdateTimeline(timeline) {

    this.timelineData.push(timeline);

    // if (!this.timelineData) {
    //   this.timelineData = [timeline];
    // } else {
    //   var index = -1;
    //   for (var i = 0; i < this.timelineData.length; i++) {
    //     if (this.timelineData[i].$key == timeline.$key) {
    //       index = i;
    //     }
    //   }
    //   if (index > -1) {
    //     this.timelineData[index] = timeline;
    //   } else {
    //     this.timelineData.unshift(timeline);
    //   }
    // }
  }

  // addPost() {
  //   this.navCtrl.push(AddPostPage);
  // }

  autoLikePost(post) {

    // console.log("isLike("+post.isLike+")");
    if(post.isLike) {
      this.firebaseProvider.delikePost(post.$key);
    } else {
      this.firebaseProvider.likePost(post.$key);
    }    
  }

  likePost(post) {
    // console.log("likePost => isLike("+post.isLike+")");
    this.firebaseProvider.likePost(post.$key);
  }

  delikePost(post) {
    // console.log("delikePost => isLike("+post.isLike+")");
    this.firebaseProvider.delikePost(post.$key);
  }

  commentPost(post) {
    // this.navCtrl.push(CommentsPage, {
    //   postKey: post.$key
    // });

    const modal = this.modalCtrl.create(CommentsPage, {
        postKey: post.$key
      });
    modal.present();
  }

  openMap(lat, long) {
    window.open(
      "http://maps.google.com/maps?q=" + lat + "," + long,
      "_system",
      "location=yes"
    );
  }

  // Enlarge image messages.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }

  expectSubmit(post) {

    if(this.user.isExpert == "true") {

      this.navCtrl.push(CaloriesPage, {
        timelineId: post.$key
      });
    }
  }

  messageClick() {

    this.navCtrl.push(MessagesPage);
  }

  postComment(postKey, item) {
    
    let commentText = item.commentText;

    // console.log("postKey("+postKey+") commentText("+commentText+")");
    let comment = {
      dateCreated: new Date().toString(),
      postBy: this.user.userId,
      postName: this.user.username,
      postImg: this.user.img,
      commentText: commentText,
    }
    this.firebaseProvider.commentPost(postKey,comment).then((res)=>{

        item.commentText  = '';

        this.dataProvider.getTimeline(postKey).take(1).subscribe((timeline) => {

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
                timelineId: postKey,
                isRead: false,
                dateCreated: timeStarts,
                fromUserId: firebase.auth().currentUser.uid
              };
              // 新增一筆通知
              this.dataProvider.updateNotification(postBy, notificationData);
            }
          }
        });
    })
  }

  addGroupPost(type: string, groupId: string, fab: FabContainer) {

    console.log("addGroupPost ==>");

    fab.close();

    const modal = this.modalCtrl.create(AddPostPage, {paramType: type, groupId: groupId});
    modal.present();
  }

  // Back
  back() {
    this.navCtrl.pop();
  }
}
