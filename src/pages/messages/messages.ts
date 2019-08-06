import {Component} from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {DataProvider} from '../../providers/data';
import {MessagePage} from '../message/message';
import * as firebase from 'firebase';
import {LoadingProvider} from '../../providers/loading';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {

  private conversations: any;
  private updateDateTime: any;
  private searchFriend: any;
  public customerServiceUser: any;

  // APP 智能AI
  // 帳號 ai@nulla.com.tw
  // 密碼 24621850
  private customerServiceId: string = 'FKJIu6pS4ufifw40f8DGHIRhS0M2';


  constructor(
    public navCtrl: NavController, 
    public app: App, 
    public loadingProvider: LoadingProvider,
    public dataProvider: DataProvider) { }

  ionViewDidLoad() {

    // 一般使用者
    if(firebase.auth().currentUser.uid != this.customerServiceId) {
      
      this.dataProvider.getUser(this.customerServiceId).subscribe((user) => {
        this.customerServiceUser = user;
        console.log("this.customerServiceUser ==>");
        console.log(this.customerServiceUser);
      });

    // APP 智能AI
    } else {

      // Create userData on the database if it doesn't exist yet.
      this.searchFriend = '';
      this.loadingProvider.show();

      // Get info of conversations of current logged in user.
      this.dataProvider.getConversations().subscribe((conversations) => {
        // console.log("conversations ==>");
        // console.log(conversations);

        if (conversations.length > 0) {

          conversations.forEach((conversation) => {
            if (conversation.$exists()) {

              // console.log(conversation);

              // Get conversation partner info.
              this.dataProvider.getUser(conversation.$key).subscribe((user) => {

                console.log("user ==>");
                console.log(user);

                conversation.friend = user;
                // Get conversation info.
                this.dataProvider.getConversation(conversation.conversationId).subscribe((obj) => {

                  console.log("obj ==>");
                  console.log(obj);

                  // Get last message of conversation.
                  let lastMessage = obj.messages[obj.messages.length - 1];
                  conversation.date = lastMessage.date;
                  conversation.sender = lastMessage.sender;
                  // Set unreadMessagesCount
                  conversation.unreadMessagesCount = obj.messages.length - conversation.messagesRead;
                  // Process last message depending on messageType.
                  if (lastMessage.type == 'text') {
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You: ' + lastMessage.message;
                    } else {
                      conversation.message = lastMessage.message;
                    }
                  } else if(lastMessage.type == 'audio'){
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You sent a audio message.';
                    } else {
                      conversation.message = 'has sent you a audio message.';
                    }
                  } else{
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You sent a photo message.';
                    } else {
                      conversation.message = 'has sent you a photo message.';
                    }
                  }
                  // Add or update conversation.
                  this.addOrUpdateConversation(conversation);

                  console.log("conversations ==>");
                  console.log(conversations);
                });
              });
            }
          });
          this.loadingProvider.hide();
        } else {
          this.conversations = [];
          this.loadingProvider.hide();
        }
      });
    }
  }

  message(userId) {

    console.log("message ==> userId("+userId+")");

    this.navCtrl.push(MessagePage, { userId: userId });    
  }

  // Add or update conversation for real-time sync based on our observer, sort by active date.
  addOrUpdateConversation(conversation) {
    if (!this.conversations) {
      this.conversations = [conversation];
    } else {
      var index = -1;
      for (var i = 0; i < this.conversations.length; i++) {
        if (this.conversations[i].$key == conversation.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversations[index] = conversation;
      } else {
        this.conversations.push(conversation);
      }
      // Sort by last active date.
      this.conversations.sort((a: any, b: any) => {
        let date1 = new Date(a.date);
        let date2 = new Date(b.date);
        if (date1 > date2) {
          return -1;
        } else if (date1 < date2) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }

}
