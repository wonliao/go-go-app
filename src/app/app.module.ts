import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Camera} from "@ionic-native/camera";
import {Keyboard} from "@ionic-native/keyboard";
import {Toast} from "@ionic-native/toast";
import {MyApp} from "./app.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SettingsProvider } from '../providers/settings/settings';
import { Facebook } from '@ionic-native/facebook';
import { LineLogin } from '@ionic-native/line-login';
import { CodePush } from '@ionic-native/code-push';

import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {VerificationPage} from "../pages/verification/verification";
import {TrialPage} from "../pages/trial/trial";
import {TabsPage} from "../pages/tabs/tabs";
import {MessagesPage} from "../pages/messages/messages";
import {GroupsPage} from "../pages/groups/groups";
import {FriendsPage} from "../pages/friends/friends";
import {SearchPeoplePage} from "../pages/search-people/search-people";
import {RequestsPage} from "../pages/requests/requests";
import {UserInfoPage} from "../pages/user-info/user-info";
import {NewMessagePage} from "../pages/new-message/new-message";
import {MessagePage} from "../pages/message/message";
import {NewGroupPage} from "../pages/new-group/new-group";
import {GroupPage} from "../pages/group/group";
import {AddPostPage} from "../pages/add-post/add-post";
import {UpdateContactPage} from "../pages/update-contact/update-contact";
import {TimelinePage} from "../pages/timeline/timeline";
import {GroupInfoPage} from "../pages/group-info/group-info";
import {AddMembersPage} from "../pages/add-members/add-members";
import {ImageModalPage} from "../pages/image-modal/image-modal";




import {LoginProvider} from "../providers/login";
import {LogoutProvider} from "../providers/logout";
import {LoadingProvider} from "../providers/loading";
import {AlertProvider} from "../providers/alert";
import {ImageProvider} from "../providers/image";
import {DataProvider} from "../providers/data";
import {FirebaseProvider} from "../providers/firebase";
import {CountryCodeProvider} from "../providers/country-code";
import {CommentsPage} from "../pages/comments/comments";
import {VideoCallPage} from "../pages/video-call/video-call";
import {UsersPage} from "../pages/users/users";
import {ReportedPostPage} from "../pages/reported-post/reported-post";
// import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import * as firebase from "firebase/app";
import {NativeAudio} from "@ionic-native/native-audio";
// import {AdMobFree} from "@ionic-native/admob-free";
import {SocialSharing} from "@ionic-native/social-sharing";
import {Contacts} from "@ionic-native/contacts";
import {IonicStorageModule} from "@ionic/storage";
import {File} from "@ionic-native/file";
import {MediaCapture} from "@ionic-native/media-capture";
import {CordovaMediaProvider, defaultAudioProviderFactory, IonicAudioModule, WebAudioProvider} from "ionic-audio";
import {InAppBrowser} from "@ionic-native/in-app-browser";

import {Badge} from "@ionic-native/badge";

import {Login} from "../login";

import {FriendPipe} from "../pipes/friend";
import {SearchPipe} from "../pipes/search";
import {ConversationPipe} from "../pipes/conversation";
import {DateFormatPipe} from "../pipes/date";
import {GroupPipe} from "../pipes/group";
// import {VideoProvider} from "../providers/video";
import { PrivacyPage } from "../pages/privacy/privacy";
import { ProfilePage } from "../pages/profile/profile";
import { PaymentRecordPage } from "../pages/payment-record/payment-record";
import { ShopPage } from "../pages/shop/shop";
import { BroadcastPage } from "../pages/broadcast/broadcast";
import { TermsPage } from "../pages/terms/terms";
import { ContactPage } from "../pages/contact/contact";
import { LogoutBlankPage } from "../pages/logout-blank/logout-blank";
import { SearchPage } from "../pages/search/search";
import { NotificationPage } from "../pages/notification/notification";
import { ProfileDetialPage } from "../pages/profile-detial/profile-detial";
import { SettingPage } from "../pages/setting/setting";
import { CaloriesPage } from "../pages/calories/calories";
import { SideMenuPage } from "../pages/side-menu/side-menu";
import { PrivatePage } from "../pages/private/private";


export function myCustomAudioProviderFactory() {
  return window.hasOwnProperty("cordova")
    ? new CordovaMediaProvider()
    : new WebAudioProvider();
}

firebase.initializeApp(Login.firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    VerificationPage,
    TrialPage,
    TabsPage,
    MessagesPage,
    GroupsPage,
    FriendsPage,
    SearchPeoplePage,
    RequestsPage,
    UserInfoPage,
    NewMessagePage,
    MessagePage,
    NewGroupPage,
    GroupPage,
    GroupInfoPage,
    AddMembersPage,
    ImageModalPage,
    FriendPipe,
    ConversationPipe,
    SearchPipe,
    DateFormatPipe,
    GroupPipe,
    TimelinePage,
    AddPostPage,
    CommentsPage,
    VideoCallPage,
    UpdateContactPage,
    ReportedPostPage,
    UsersPage,
    ProfilePage,        // 個人資料
    ProfileDetialPage,  // 個人詳細資料
    PaymentRecordPage,  // 付款紀錄
    ShopPage,           // 購買計畫
    BroadcastPage,      // 推播設定
    TermsPage,          // 使用條款
    PrivacyPage,        // 隱私權政策
    ContactPage,        // 聯絡我們
    LogoutBlankPage,    // 登出後顯示的空白頁
    SearchPage,         // 搜尋頁
    NotificationPage,   // 訊息頁
    SettingPage,        // 個人設定頁
    CaloriesPage,       // 卡路里評分
    SideMenuPage,       // 側邊欄
    PrivatePage,        // 隱私設定
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicAudioModule.forRoot(defaultAudioProviderFactory),
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      mode: "ios",
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(Login.firebaseConfig),
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    VerificationPage,
    TrialPage,
    TabsPage,
    MessagesPage,
    GroupsPage,
    FriendsPage,
    SearchPeoplePage,
    RequestsPage,
    UserInfoPage,
    NewMessagePage,
    MessagePage,
    NewGroupPage,
    GroupPage,
    GroupInfoPage,
    AddMembersPage,
    ImageModalPage,
    TimelinePage,
    AddPostPage,
    CommentsPage,
    VideoCallPage,
    UpdateContactPage,
    ReportedPostPage,
    UsersPage,
    ProfilePage,        // 個人資料
    ProfileDetialPage,  // 個人詳細資料
    PaymentRecordPage,  // 付款紀錄
    ShopPage,           // 購買計畫
    BroadcastPage,      // 推播設定
    TermsPage,          // 使用條款
    PrivacyPage,        // 隱私權政策
    ContactPage,        // 聯絡我們
    LogoutBlankPage,    // 登出後顯示的空白頁
    SearchPage,         // 搜尋頁
    NotificationPage,   // 訊息頁
    SettingPage,        // 個人設定頁
    CaloriesPage,       // 卡路里評分
    SideMenuPage,       // 側邊欄
    PrivatePage,        // 隱私設定
  ],
  providers: [
    Facebook,
    LineLogin,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Camera,
    MediaCapture,
    File,
    Keyboard,
    Toast,
    CountryCodeProvider,
    Contacts,
    // AdMobFree,
    Badge,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    LogoutProvider,
    LoadingProvider,
    AlertProvider,
    ImageProvider,
    DataProvider,
    FirebaseProvider,
    NativeAudio,
    // VideoProvider,
    SettingsProvider,
    CodePush,
  ]
})
export class AppModule {
}
