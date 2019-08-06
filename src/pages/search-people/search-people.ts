import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {DataProvider} from '../../providers/data';
import {LoadingProvider} from '../../providers/loading';
import {AlertProvider} from '../../providers/alert';
import {FirebaseProvider} from '../../providers/firebase';
import {AngularFireDatabase} from 'angularfire2/database';
import { ProfilePage } from '../profile/profile';
// import {UserInfoPage} from '../user-info/user-info';

@Component({
  selector: 'page-search-people',
  templateUrl: 'search-people.html'
})
export class SearchPeoplePage {
  private accounts: any = [];
  private alert: any;
  private account: any;
  private excludedIds: any;
  private user;
  private requestsSent: any;
  private friendRequests: any;
  private searchUser: any;
  // SearchPeoplePage
  // This is the page where the user can search for other users and send a friend request.
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider, public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController, public angularDb:AngularFireDatabase, public alertProvider: AlertProvider, public firebaseProvider: FirebaseProvider) { }

  ionViewDidLoad() {
    // Initialize
    // this.loadingProvider.show();
    this.searchUser = '';

    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = user;
    });

    // 取得專家列表
    this.dataProvider.getExperts().subscribe((accounts) => {
      console.log(accounts);
      this.accounts = accounts;
    });

    //   this.loadingProvider.hide();
    //   this.accounts = accounts;
      
    //   // 排除自已及好友
    //   this.dataProvider.getCurrentUser().subscribe((account) => {

    //     // 排除自已
    //     // Add own userId as exludedIds.
    //     this.excludedIds = [];
    //     this.account = account;
    //     if (this.excludedIds.indexOf(account.$key) == -1) {
    //       this.excludedIds.push(account.$key);
    //     }
        
    //     // // 排除好友
    //     // // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
    //     // if (account.friends) {
    //     //   account.friends.forEach(friend => {
    //     //     if (this.excludedIds.indexOf(friend) == -1) {
    //     //       this.excludedIds.push(friend);
    //     //     }
    //     //   });
    //     // }

    //     // Get requests of the currentUser.
    //     // this.dataProvider.getRequests(account.$key).subscribe((requests) => {
    //     //   this.requestsSent = requests.requestsSent;
    //     //   this.friendRequests = requests.friendRequests;
    //     // });
    //   });
    // });
  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    if (this.requestsSent) {
      for (var i = 0; i < this.requestsSent.length; i++) {
        if (this.requestsSent[i] == user.$key) {
          return 1;
        }
      }
    }
    if (this.friendRequests) {
      for (var i = 0; i < this.friendRequests.length; i++) {
        if (this.friendRequests[i] == user.$key) {
          return 2;
        }
      }
    }
    return 0;
  }

  // Send friend request.
  sendFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // Cancel friend request sent.
  cancelFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // Accept friend request.
  acceptFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject Request',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(user.$key);
          }
        },
        {
          text: 'Accept Request',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // View user.
  viewUser(userId) {

    // this.navCtrl.push(UserInfoPage, {userId: userId});
    this.navCtrl.push(ProfilePage, {userId: userId});
  }

  getItems() {

    if(this.searchUser && this.searchUser.length > 2) {
      this.dataProvider.getUserWithUsername(this.searchUser).subscribe(accounts => {

        // console.log(accounts);
        this.accounts = accounts;
      });
    } else if(!this.searchUser || this.searchUser.length <= 0) {

      // 取得專家列表
      this.dataProvider.getExperts().subscribe((accounts) => {
        console.log(accounts);
        this.accounts = accounts;
      });
    }
  }
}
