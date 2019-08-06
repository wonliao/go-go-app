import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import * as firebase from "firebase";
import { Contacts } from "@ionic-native/contacts";
import { Storage } from "@ionic/storage";
import async from "async";
import _ from 'lodash';
import {LoadingProvider} from "./loading";
import "rxjs/add/operator/map";

@Injectable()
export class DataProvider {
  // Data Provider
  // This is the provider class for most of the Firebase observables in the app.
  webRTCClient;
  incomingCallId;
  userContactsList = [];
  userOnlyContacts = [];
  exitsUserList = [];
  inviteUserList = [];
  userContactsListWithCountryCode = [];
  isContactGet = false;
  countryCode = "+1";
  constructor(
    public events: Events,
    public angularDb: AngularFireDatabase,
    private contacts: Contacts,
    private storage: Storage,
    public loadingProvider: LoadingProvider
  ) {
  }

  // set webRTCClient
  setWebRTCClient(val) {
    this.webRTCClient = val;
  }

  // get webRTCClient
  getwebRTCClient() {
    return this.webRTCClient;
  }

  // set Incoming Call id
  setIncomingCallId(id) {
    this.incomingCallId = id;
  }

  // get incoming call id
  getIncomingCallid() {
    return this.incomingCallId;
  }

  // Get all users
  getUsers() {
    return this.angularDb.list("/accounts", {
      query: {
        orderByChild: "name"
      }
    });
  }

  // Get user with username
  getUserWithUsername(username) {
    return this.angularDb.list("/accounts", {
      query: {
        orderByChild: "username",
        // equalTo: username,
        startAt: username,
        endAt: username + "\uf8ff"
      }
    });
  }

  // Get user with phonenumber
  getUserWithPhonenumber(phoneNumber) {
    return this.angularDb.list("/accounts", {
      query: {
        orderByChild: "phoneNumber",
        equalTo: phoneNumber
      }
    });
  }

  // 取得全部專家
  getExperts() {
    return this.angularDb.list("/accounts", {
      query: {
        orderByChild: "isExpert",
        equalTo: "true"
        // startAt: 1
      }
    });
  }

  getExpertList() {
    return this.angularDb.list(
      "/experts"
    );
  }

  // Get logged in user data
  getCurrentUser() {
    
    return this.angularDb.object(
      "/accounts/" + firebase.auth().currentUser.uid
    );
  }

  // Get user by their userId
  getUser(userId) {
    return this.angularDb.object("/accounts/" + userId);
  }

  getMember(userId) {
    return this.angularDb.object("/members/" + userId);
  }

  // Get requests given the userId.
  getRequests(userId) {
    return this.angularDb.object("/requests/" + userId);
  }

  // Get friend requests given the userId.
  getFriendRequests(userId) {
    return this.angularDb.list("/requests", {
      query: {
        orderByChild: "receiver",
        equalTo: userId
      }
    });
  }

  // Get conversation given the conversationId.
  getConversation(conversationId) {
    return this.angularDb.object("/conversations/" + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations() {
    return this.angularDb.list(
      "/accounts/" + firebase.auth().currentUser.uid + "/conversations"
    );
  }

  // // 取得客服聊天群組
  // getServiceConversations() {
  //   return this.angularDb.list(
  //     "/accounts/uJvJiOPTZNPWDcppnQBxGqdOBio1"
  //   );
  // }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.angularDb.object(
      "/conversations/" + conversationId + "/messages"
    );
  }

  // Get messages of the group given the Id.
  getGroupMessages(groupId) {
    return this.angularDb.object("/groups/" + groupId + "/messages");
  }

  // Get groups of the logged in user.
  getGroups() {
    return this.angularDb.list("/groups/");
  }

  // Get group info given the groupId.
  getGroup(groupId) {
    return this.angularDb.object("/groups/" + groupId);
  }

  // Get Timeline of user
  getTimelines() {
    return this.angularDb.list(
      "/accounts/" + firebase.auth().currentUser.uid + "/timeline"
    );
  }

  // Get Timeline by user id
  getTimelineByUid(id) {
    return this.angularDb.object(
      "/accounts/" + id + "/timeline"
    );
  }

  getTimelineById(id) {
    return this.angularDb.list("/timeline", {
      query: {
        orderByChild: "id",
        equalTo: id
      }
    });
  }

  // 取得體重資料
  getWeightData(id, startAt, endAt) {

    return this.angularDb.list(
      "/accounts/" + id + "/baseData/weight", {
        query: {
          orderByChild: "dateCreated",
          startAt: startAt,
          endAt: endAt
        }
      }
    );
  }

    // 取得最新體重資料
    getLastWeightData(id) {

      return this.angularDb.list(
        "/accounts/" + id + "/baseData/weight", {
          query: {
            orderByChild: "dateCreated",
            limitToLast: 1
          }
        }
      );
    }

  // Get Timeline post
  getTimelinePost() {
    return this.angularDb.list("/timeline");
  }

  getAllReportedPost() {
    return this.angularDb.list("/reportPost");

  }

  // Get time line by id
  getTimeline(timelineId) {
    return this.angularDb.object("/timeline/" + timelineId);
  }

  getTimeline2(timelineId) {
    return this.angularDb.list("/timeline/" + timelineId);
  }

  // Get Friend List
  getFriends() {
    return this.angularDb.list(
      "/accounts/" + firebase.auth().currentUser.uid + "/friends"
    );
  }

  // Get comments list
  getComments(postId) {
    return this.angularDb.list("/comments/" + postId);
  }

  // Get likes
  getLike(postId) {
    return this.angularDb.list("/likes/" + postId);
  }

  postLike(postId) {
    return this.angularDb.object("/likes/" + postId);
  }

  // Get likes
  getdisLike(postId) {
    return this.angularDb.list("/dislikes/" + postId);
  }

  postdisLike(postId) {
    return this.angularDb.object("/dislikes/" + postId);
  }
  // post Comments
  postComments(postId) {
    return this.angularDb.object("/comments/" + postId);
  }

  // post Comments
  postCommentsReply(postId, key) {
    return this.angularDb.object("/comments/" + postId  + "/" + key + "/reply");
  }

  // report post to admin
  getReportPost(postId) {
    // console.log("postId", postId)
    return this.angularDb.object("/reportPost/" + postId);
  }

  getDiets(memberId) {
    return this.angularDb.list("/diets", {
      query: {
        orderByChild: "member_id",
        equalTo: memberId
      }
    });
  }

  // read contact
  getContact() {
    return new Promise((resolve, reject) => {
      if (!this.isContactGet) {
        this.contacts.find(["*"], {}).then(
          contacts => {
            this.userContactsList = [];
            this.isContactGet = true;
            // this.contactlist = data
            for (let i = 0; i < contacts.length; i++) {
              if (contacts[i].phoneNumbers) {
                // for(let j = 0; j < contacts[i].phoneNumbers.length; j++) {
                if (
                  contacts[i].phoneNumbers[0].value.toString().charAt(0) ==
                  "*" ||
                  contacts[i].phoneNumbers[0].value.toString().charAt(0) == "#"
                ) {
                } else {
                  let user = {
                    name: this.getNameFromContact(
                      contacts[i],
                      contacts[i].phoneNumbers[0].value.toString()
                    ),
                    phoneNumber: contacts[i].phoneNumbers[0].value.toString()
                  };
                  this.userOnlyContacts.push(
                    contacts[i].phoneNumbers[0].value.toString()
                  );
                  this.userContactsList.push(user);
                }
                // }
              }
            }
            resolve(this.userOnlyContacts);
            this.isContactGet = false;
          },
          err => {
            reject(false);
          }
        );
      } else {
        resolve(this.userContactsList);
      }
    });
  }

  getNameFromContact(contact, number) {
    if (contact.name) {
      if (contact.name.formatted) {
        return contact.name.formatted;
      } else {
        return number;
      }
    } else {
      return number;
    }
  }

  setContactWithCountryCode(countryCode) {
    this.countryCode = countryCode;
    return new Promise((resolve, reject) => {
      async.map(
        this.userContactsList,
        (item, CB) => {
          this.checkContact(item, CB);
        },
        (err, results) => {
          // results is now an array of stats for each file
          if (err) {
            reject(false)
          } else {
            let contact = results;
            resolve(contact)
          }
        }
      );
    });
  }

  checkContact(item, callback) {
    let temp = item.phoneNumber.trim();
    temp = temp.split(")").join("");
    temp = temp.split("(").join("");
    temp = temp.split(" ").join("");
    temp = temp.replace(/\s/g, "");
    temp = temp.split("-").join("");
    if (temp.charAt(0) == "+") {
    } else if (temp.charAt(0) == "0" && temp.charAt(1) == "0") {
      let _tempConatct = "+" + temp.substr(2);
      item["phoneNumber"] = _tempConatct;
    } else if (temp.charAt(0) == "0") {
      let _tempConatct = this.countryCode + temp.substr(1);
      item["phoneNumber"] = _tempConatct;
    } else {
      let numberWithCountryCode = this.countryCode + temp;
      item["phoneNumber"] = numberWithCountryCode;
    }
    this.getUserWithPhonenumber(item.phoneNumber).subscribe(data => {
      if (data.length > 0) {
        item["isUser"] = "1";
      } else {
        item["isUser"] = "0";
      }
    });
    callback(null, item);
  }

  // setContactWithCountryCode(countryCode) {
  //   // this.userContactsListWithCountryCode = [];
  //   return new Promise((resolve, reject) => {
  //     for (let i = 0; i < this.userContactsList.length; i++) {
  //       let temp = this.userContactsList[i].phoneNumber;
  //       temp = temp.split(")").join("");
  //       temp = temp.split("(").join("");
  //       temp = temp.split(" ").join("");
  //       temp = temp.replace(/\s/g, "");
  //       temp = temp.split("-").join("");

  //       if (temp.charAt(0) == "+") {
  //       } else if (temp.charAt(0) == "0" && temp.charAt(1) == "0") {
  //         let _tempConatct = "+" + temp.substr(2);
  //         this.userContactsList[i].phoneNumber = _tempConatct;
  //       } else if (temp.charAt(0) == "0") {
  //         let _tempConatct = countryCode + temp.substr(1);
  //         this.userContactsList[i].phoneNumber = _tempConatct;
  //       } else {
  //         let numberWithCountryCode = countryCode + temp;
  //         this.userContactsList[i].phoneNumber = numberWithCountryCode;
  //       }
  //     }
  //     resolve(this.userContactsList);
  //     this.checkUserExitsOrNot(this.userContactsList);
  //
  //   });
  // }

  setData(key, val) {
    this.storage.set(key, val);
  }

  getData(key) {
    return this.storage.get(key).then(val => {
      return val;
    });
  }

  clearData() {
    this.storage.clear();
  }

  checkUserExitsOrNot(userContactsList) {
    this.exitsUserList = [];
    this.inviteUserList = [];
    userContactsList.forEach(contacts => {
      this.getUserWithPhonenumber(contacts.phoneNumber).subscribe(data => {
        if (data.length > 0) {
          this.exitsUserList.push(userContactsList);
        } else {
          this.inviteUserList.push(userContactsList);
        }
      });
    });
  }

  removePost(post) {

    this.angularDb.object("/combine/" + post.postBy + "/timeline/" + post.$key).remove()



    // this.getUser(post.postBy).take(1).subscribe((user) => {
      
      // var timeline = account.timeline;

      // _.remove(timeline, (n) => {
      //   return n == post.$key
      // });
      
      // this.getUser(post.postBy).update({
      //   timeline: timeline
      // }).then((success) => {

      //   this.getTimeline(post.$key).remove().then((success) => {
      //     this.angularDb.object('/reportPost/' + post.$key).remove();
      //   }).catch((error) => {
      //   })
      // });
    // })
  }

  ignorePost(post) {
    // console.log("ingnore post ", post)
    this.angularDb.object('/reportPost/' + post.$key).remove()
  }

  unFriend(userId) {
    /**
     * Remove friend id from friend account
     */
    this.getUser(userId).take(1).subscribe((account) => {
      var friends = account.friends;
      // console.log("==friend List before", friends)
      if (friends) {
        _.remove(friends, (n) => {
          return n == firebase.auth().currentUser.uid
        });
        this.getUser(userId).update({
          friends: friends
        }).then((success) => {
        })
      }
      // console.log("==friend List after", friends)
    })
    /**
     * Remove friend id from login user account
     */
    this.getUser(firebase.auth().currentUser.uid).take(1).subscribe((account) => {
      var friends = account.friends;
      // console.log("==user List before", friends);
      if (friends) {
        _.remove(friends, (n) => {
          return n == userId
        });
        this.getUser(firebase.auth().currentUser.uid).update({
          friends: friends
        }).then((success) => {
        })
      }
      // console.log("==user List after", friends);
    })
  }

  // Get Notification
  getNotification(phoneNumber) {
    return this.angularDb.list("/notification/" + phoneNumber);
  }

  updateNotification(userId, item) {
    this.angularDb.list("/notification/" + userId).push(item);
  }

  getSubscription(userId) {
    return this.angularDb.object("/subscription/" + userId);
  }

  bindingAccount(user, phoneNumber) {

    // console.log("bindingAccount ==> phoneNumber("+phoneNumber+")");
    return new Promise((resolve,reject)=>{

      this.getMember(user.userId).subscribe(member => {

        // console.log("member ==>");
        // console.log(member);
  
        if(member.$exists()) {
  
          // console.log("member is exists ==>");
  
          // 複製 members -> accounts
          this.copyMemberToAccount(user, member).then(() =>{

            // 複製 diets -> timeline
            this.copyDietToTimeline(phoneNumber, member.id, user).then(() =>{

              resolve(true);
            });
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  // 複製 members -> accounts
  copyMemberToAccount(user, member) {

    return this.getUser(user.userId).update({
      dateCreated: (member.created_at)? member.created_at: (user.created_at)?user.created_at: "",
      img: (member.pic)? member.pic: (user.img)? user.img: "",
      name: (member.name)? member.name: (user.name)? user.name: "",
      username: (member.name)? member.name: (user.name)? user.name: "",
      access_token: (member.access_token)? member.access_token: (user.access_token)? user.access_token: "",
      access_utc: (member.access_utc)? member.access_utc: (user.access_utc)? user.access_utc: "",
      active_token: (member.active_token)? member.active_token: (user.active_token)? user.active_token: "",
      active_utc: (member.active_utc)? member.active_utc: (user.active_utc)? user.active_utc: "",
      alarm_weight: (member.alarm_weight)? member.alarm_weight: (user.alarm_weight)? user.alarm_weight: "",
      birth: (member.birth)? member.birth: (user.birth)? user.birth: "",
      code: (member.code)? member.code: (user.code)? user.code: "",
      expert_vw: (member.expert_vw)? member.expert_vw: (user.expert_vw)? user.expert_vw: "",
      god_vw: (member.god_vw)? member.god_vw: (user.god_vw)? user.god_vw: "",
      member_id: (member.id)? member.id: (user.id)? user.id: "",
      is_admin: (member.is_admin)? member.is_admin: (user.is_admin)? user.is_admin: "",
      level: (member.level)? member.level: (user.level)? user.level: "",
      parent_id: (member.parent_id)? member.parent_id: (user.parent_id)? user.parent_id: "",
      password: (member.password)? member.password: (user.password)? user.password: "",
      pay: (member.pay)? member.pay: (user.pay)? user.pay: "",
      post_share_type: (member.post_share_type)? member.post_share_type: (user.post_share_type)? user.post_share_type: "",
      real_name: (member.real_name)? member.real_name: (user.real_name)? user.real_name: "",
      remember_token: (member.remember_token)? member.remember_token: (user.remember_token)? user.remember_token: "",
      social_id: (member.social_id)? member.social_id: (user.social_id)? user.social_id: "",
      sex: (member.sex)? member.sex: (user.sex)? user.sex: "",
      type: (member.type)? member.type: (user.type)? user.type: "",
      status: (member.status)? member.status: (user.status)? user.status: "",
      updated_at: (member.updated_at)? member.updated_at: (user.updated_at)? user.updated_at: ""
    });
  }

  // 複製 diets -> timeline
  copyDietToTimeline(phoneNumber, memberId, user) {

    // console.log("phoneNumber("+phoneNumber+")");

    return new Promise((resolve,reject)=>{

      this.getDiets(memberId).take(1).subscribe(diets => {
        
        for (let i = 0; i < diets.length; i++) {

          var diet = diets[i];
          // console.log("id("+diet.id+") phoneNumber("+phoneNumber+")");

          var postType = "";
          if(diet.type == "caloria")  postType = "food";      // 紀錄飲食
          else if(diet.type == "weight")  postType = "body";  // 紀錄身體
          else if(diet.type == "life")  postType = "post";    // 發表貼文

          this.angularDb.list('timeline').update(diet.$key, {
            postType: postType,
            dateCreated: diet.created_at,
            postBy: phoneNumber,
            userId: user.userId,
            foodName: (diet.name)? diet.name: "",
            postText: (diet.desp)? diet.desp: "",
            shareType: (diet.share_type)? diet.share_type: "",
            weight: (diet.value)? diet.value: "",
            menstruation: (diet.is_moon == 1)? true: false,
            image: (diet.photo)? diet.photo: "",
            fat: (diet.fat)? diet.fat: "",
            protein: (diet.protein)? diet.protein: "",
            sugar: (diet.sugar)? diet.sugar: "",
            id: (diet.id)? diet.id: "",
            meal_time: (diet.meal_time)? diet.meal_time: "",
            member_id: (diet.member_id)? diet.member_id: "",
            calorie_id: (diet.calorie_id)? diet.calorie_id: "",
            message_id: (diet.message_id)? diet.message_id: "",
            updated_at: (diet.updated_at)? diet.updated_at: ""
          });

          let timelineId = diet.$key;
          this.getTimeline(timelineId).subscribe((timeline) => {

            // console.log("timelineId("+timeline.$key+")");
            var temp = {
              postBy: phoneNumber,
              dateCreated: timeline.dateCreated,
              weight: (timeline.weight)? timeline.weight: ""
            };  

            this.addTimelineToAccount(user, timelineId, temp, false);
          });
        }

        resolve(true);
      });
    });
  }

  // TimeLine
  addTimelineToAccount(user, timelineId, data, refreshFlag) {

    // Timeline
    var timelineTemp = {
      timelineId: timelineId,
      dateCreated: data.dateCreated,
      postBy: data.postBy
    };
    if(refreshFlag == true) {

      this.angularDb.object('/combine/' + user.phoneNumber + '/timeline/' + timelineId).update(timelineTemp).then(() => {
        // 更新 Timeline
        this.events.publish("refreshTimeline");
      });
    } else {

      this.angularDb.object('/combine/' + user.phoneNumber + '/timeline/' + timelineId).update(timelineTemp);
    }
    
    // 體重
    if (data.weight != "") {
      var weightTemp = {
        timelineId: timelineId,
        dateCreated: data.dateCreated,
        weight: data.weight,
        postBy: data.postBy
      };
      // this.angularDb.object('/accounts/' + loggedInUserId + '/baseData/weight/' + timelineId).update(weightTemp);
      this.angularDb.object('/combine/' + user.phoneNumber + '/weight/' + timelineId).update(weightTemp);
    }
  }

  // Get Timeline post
  getMyTimelinePost(phoneNumber, startAt) {
    
    // console.log("getMyTimelinePost ==> phoneNumber("+phoneNumber+") startAt("+startAt+")");
    
    if(startAt == "") {

      return this.angularDb.list("/combine/" + phoneNumber + "/timeline", {
        query: {
          orderByKey: true,
          limitToLast: 3
        }
      }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

    } else {

      return this.angularDb.list("/combine/" + phoneNumber + "/timeline", {
        query: {
          orderByKey: true,
          endAt: startAt, //"-LilUPGJbLSFUQQr5mIB",
          limitToLast: 4
        }
      }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    }
  }

  getGroupTimelinePost(groupId, startAt) {

    // console.log("getGroupTimelinePost ==> groupId("+groupId+") startAt("+startAt+")");    
    if(startAt == "") {

      return this.angularDb.list("/groups/" + groupId + "/timeline", {
        query: {
          orderByKey: true,
          limitToLast: 3
        }
      }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

    } else {

      return this.angularDb.list("/groups/" + groupId + "/timeline", {
        query: {
          orderByKey: true,
          endAt: startAt,
          limitToLast: 4
        }
      }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
    }
  }
}
