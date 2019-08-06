import {Injectable} from "@angular/core";
import {AlertController, ToastController} from "ionic-angular";
import {Validator} from "../validator";
import { LoadingProvider } from "../providers/loading";
// import {Toast} from "@ionic-native/toast";

const errorMessages = {
  // Alert Provider
  // This is the provider class for most of the success and error messages in the app.
  // If you added your own messages don't forget to make a function for them or add them in the showErrorMessage switch block.

  // Firebase Error Messages
  accountExistsWithDifferentCredential: {
    title: "帳號已存在！",
    subTitle: "已存在相同的帳號。"
  },
  invalidCredential: {
    title: "憑證無效！",
    subTitle: "使用此憑據登錄時出錯。"
  },
  operationNotAllowed: {
    title: "登入失敗！",
    subTitle:
      "不允許使用此提供商登錄！請聯繫支持部門。"
  },
  userDisabled: {
    title: "帳戶已禁用！",
    subTitle:
      "對不起！但是這個帳戶已被暫停！請聯繫支持部門。"
  },
  userNotFound: {
    title: "帳戶未找到！",
    subTitle: "抱歉，找不到具有此憑證的帳戶。"
  },
  wrongPassword: {
    title: "密碼不正確！",
    subTitle: "抱歉，您輸入的密碼不正確。"
  },
  invalidEmail: {
    title: "電子郵件無效！",
    subTitle: "抱歉，您輸入了無效的電子郵件地址。"
  },
  emailAlreadyInUse: {
    title: "電子郵件不可用！",
    subTitle: "抱歉，此電子郵件已被使用。"
  },
  weakPassword: {
    title: "弱密碼！",
    subTitle: "抱歉，你輸了一個弱密碼。"
  },
  requiresRecentLogin: {
    title: "憑據已過期！",
    subTitle: "抱歉，這個憑證已經過期！請再次登錄。"
  },
  userMismatch: {
    title: "用戶不匹配！",
    subTitle: "抱歉，這個憑證適用於其他用戶！"
  },
  providerAlreadyLinked: {
    title: "已經連接！",
    subTitle: "抱歉，您的帳戶已經與此憑證連結。"
  },
  credentialAlreadyInUse: {
    title: "憑證不可用！",
    subTitle: "抱歉，此憑證已被其他用戶使用。"
  },
  // Profile Error Messages
  changeName: {
    title: "更改名稱失敗！",
    subTitle: "抱歉，我們在更改你的名字時遇到了錯誤。"
  },
  invalidCharsName: Validator.profileNameValidator.patternError,
  nameTooShort: Validator.profileNameValidator.lengthError,
  changeEmail: {
    title: "更改電子郵件失敗！",
    subTitle:
      "抱歉，我們在更改您的電子郵件地址時遇到錯誤。"
  },
  invalidProfileEmail: Validator.profileEmailValidator.patternError,
  changePhoto: {
    title: "更改照片失敗！",
    subTitle: "抱歉，我們在更改照片時遇到錯誤。"
  },
  passwordTooShort: Validator.profilePasswordValidator.lengthError,
  invalidCharsPassword: Validator.profilePasswordValidator.patternError,
  passwordsDoNotMatch: {
    title: "更改密碼失敗！",
    subTitle: "抱歉，您輸入的密碼不相符。"
  },
  updateProfile: {
    title: "更新個人資料失敗",
    subTitle: "抱歉，我們在更新您的個人資料時遇到錯誤。"
  },
  usernameExists: {
    title: "用戶名已經存在！",
    subTitle: "抱歉，此用戶名已由其他用戶使用。"
  },
  phoneNumberExists: {
    title: "電話號碼已經存在！",
    subTitle: "抱歉，此電話號碼已由其他用戶使用。"
  },
  // Image Error Messages
  imageUpload: {
    title: "圖片上傳失敗！",
    subTitle: "抱歉，我們在上傳所選圖片時遇到錯誤。"
  },
  // Group Error Messages
  groupUpdate: {
    title: "更新社團失敗！",
    subTitle: "抱歉，我們在更新此社團時遇到錯誤。"
  },
  groupLeave: {
    title: "讓社團失敗！",
    subTitle: "抱歉，你離開這個社團時遇到了錯誤。"
  },
  groupDelete: {
    title: "刪除社團失敗！",
    subTitle: "抱歉，我們在刪除此社團時遇到錯誤。"
  }
};

const successMessages = {
  passwordResetSent: {
    title: "發送密碼重置！",
    subTitle: "密碼重置電子郵件已發送至："
  },
  profileUpdated: {
    title: "個人資料已更新！",
    subTitle: "您的個人資料已成功更新！"
  },
  phoneNumberUpdated: {
    title: "電話號碼已更新！",
    subTitle: "您的電話號碼已成功更新！"
  },
  emailVerified: {
    title: "確認電子郵件！",
    subTitle: "恭喜！您的電子郵件已經確認！"
  },
  emailVerificationSent: {
    title: "發送電子郵件確認！",
    subTitle: "已發送電子郵件確認："
  },
  accountDeleted: {
    title: "帳戶已刪除！",
    subTitle: "您的帳戶已成功刪除。"
  },
  passwordChanged: {
    title: "密碼已更改！",
    subTitle: "您的密碼已成功更改。"
  },
  friendRequestSent: {
    title: "發送好友請求！",
    subTitle: "您的朋友請求已成功發送！"
  },
  friendRequestRemoved: {
    title: "好友請求被刪除！",
    subTitle: "您的好友請求已成功刪除。"
  },
  groupUpdated: {
    title: "社團更新！",
    subTitle: "這個社團已成功更新！"
  },
  groupLeft: {
    title: "離開社團",
    subTitle: "你已經成功離開了這個社團。"
  }
};

@Injectable()
export class AlertProvider {
  private alert;

  constructor(
    public alertCtrl: AlertController,
    public loadingProvider: LoadingProvider,
    // private toast: Toast
    private toastController: ToastController
  ) {}

  // Show profile updated
  showProfileUpdatedMessage() {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.profileUpdated["title"],
        subTitle: successMessages.profileUpdated["subTitle"],
        buttons: ["確定"]
      })
      .present();
  }

  showPhoneNumberUpdatedMessage() {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.phoneNumberUpdated["title"],
        subTitle: successMessages.phoneNumberUpdated["subTitle"],
        // buttons: ["確定"]
        buttons: [
          {
            text: "確定",
            handler: () => {

              this.loadingProvider.show();
              
              setTimeout(function() {
                window.location.reload();
              }, 500);
            }
          }
        ]
        
      })
      .present();
  }

  // Show password reset sent
  showPasswordResetMessage(email) {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.passwordResetSent["title"],
        subTitle: successMessages.passwordResetSent["subTitle"] + email,
        buttons: ["確定"]
      })
      .present();
  }

  // Show email verified and redirect to homePage
  showEmailVerifiedMessageAndRedirect(navCtrl) {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.emailVerified["title"],
        subTitle: successMessages.emailVerified["subTitle"],
        buttons: [
          {
            text: "確定",
            handler: () => {
              //navCtrl.setRoot(Login.homePage);
            }
          }
        ]
      })
      .present();
  }

  // Show email verification sent
  showEmailVerificationSentMessage(email) {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.emailVerificationSent["title"],
        subTitle: successMessages.emailVerificationSent["subTitle"] + email,
        buttons: ["確定"]
      })
      .present();
  }

  // Show account deleted
  showAccountDeletedMessage() {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.accountDeleted["title"],
        subTitle: successMessages.accountDeleted["subTitle"],
        buttons: ["確定"]
      })
      .present();
  }

  // Show password changed
  showPasswordChangedMessage() {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.passwordChanged["title"],
        subTitle: successMessages.passwordChanged["subTitle"],
        buttons: ["確定"]
      })
      .present();
  }
  // show alert
  showAlert(title, subTitle) {
    this.alert = this.alertCtrl
      .create({
        title: title,
        subTitle: subTitle,
        buttons: ["確定"]
      })
      .present();
  }

  // Show friend request sent
  showFriendRequestSent() {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.friendRequestSent["title"],
        subTitle: successMessages.friendRequestSent["subTitle"],
        buttons: ["確定"]
      })
      .present();
  }

  // Show friend request removed
  showFriendRequestRemoved() {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.friendRequestRemoved["title"],
        subTitle: successMessages.friendRequestRemoved["subTitle"],
        buttons: ["確定"]
      })
      .present();
  }

  // Show group updated.
  showGroupUpdatedMessage() {
    this.alert = this.alertCtrl
      .create({
        title: successMessages.groupUpdated["title"],
        subTitle: successMessages.groupUpdated["subTitle"],
        buttons: ["確定"]
      })
      .present();
  }

  // Show error messages depending on the code
  // If you added custom error codes on top, make sure to add a case block for it.
  showErrorMessage(code) {
    switch (code) {
      // Firebase Error Messages
      case "auth/account-exists-with-different-credential":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.accountExistsWithDifferentCredential["title"],
            subTitle:
              errorMessages.accountExistsWithDifferentCredential["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/invalid-credential":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.invalidCredential["title"],
            subTitle: errorMessages.invalidCredential["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/operation-not-allowed":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.operationNotAllowed["title"],
            subTitle: errorMessages.operationNotAllowed["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/user-disabled":
        this.alert = this.alertCtrl.create({
          title: errorMessages.userDisabled["title"],
          subTitle: errorMessages.userDisabled["subTitle"],
          buttons: ["確定"]
        });
        this.alert.present();
        break;
      case "auth/user-not-found":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.userNotFound["title"],
            subTitle: errorMessages.userNotFound["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/wrong-password":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.wrongPassword["title"],
            subTitle: errorMessages.wrongPassword["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/invalid-email":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.invalidEmail["title"],
            subTitle: errorMessages.invalidEmail["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/email-already-in-use":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.emailAlreadyInUse["title"],
            subTitle: errorMessages.emailAlreadyInUse["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/weak-password":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.weakPassword["title"],
            subTitle: errorMessages.weakPassword["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/requires-recent-login":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.requiresRecentLogin["title"],
            subTitle: errorMessages.requiresRecentLogin["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/user-mismatch":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.userMismatch["title"],
            subTitle: errorMessages.userMismatch["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/provider-already-linked":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.providerAlreadyLinked["title"],
            subTitle: errorMessages.providerAlreadyLinked["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "auth/credential-already-in-use":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.credentialAlreadyInUse["title"],
            subTitle: errorMessages.credentialAlreadyInUse["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      // Profile Error Messages
      case "profile/error-change-name":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.changeName["title"],
            subTitle: errorMessages.changeName["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/invalid-chars-name":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.invalidCharsName["title"],
            subTitle: errorMessages.invalidCharsName["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/name-too-short":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.nameTooShort["title"],
            subTitle: errorMessages.nameTooShort["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/error-change-email":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.changeEmail["title"],
            subTitle: errorMessages.changeEmail["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/invalid-email":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.invalidProfileEmail["title"],
            subTitle: errorMessages.invalidProfileEmail["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/error-change-photo":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.changePhoto["title"],
            subTitle: errorMessages.changePhoto["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/password-too-short":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.passwordTooShort["title"],
            subTitle: errorMessages.passwordTooShort["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/invalid-chars-password":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.invalidCharsPassword["title"],
            subTitle: errorMessages.invalidCharsPassword["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/passwords-do-not-match":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.passwordsDoNotMatch["title"],
            subTitle: errorMessages.passwordsDoNotMatch["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/error-update-profile":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.updateProfile["title"],
            subTitle: errorMessages.updateProfile["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/error-same-username":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.usernameExists["title"],
            subTitle: errorMessages.usernameExists["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "profile/error-same-phoneNumber":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.phoneNumberExists["title"],
            subTitle: errorMessages.phoneNumberExists["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      //Image Error Messages
      case "image/error-image-upload":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.imageUpload["title"],
            subTitle: errorMessages.imageUpload["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      // Group Error MEssages
      case "group/error-update-group":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.groupUpdate["title"],
            subTitle: errorMessages.groupUpdate["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "group/error-leave-group":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.groupLeave["title"],
            subTitle: errorMessages.groupLeave["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
      case "group/error-delete-group":
        this.alert = this.alertCtrl
          .create({
            title: errorMessages.groupDelete["title"],
            subTitle: errorMessages.groupDelete["subTitle"],
            buttons: ["確定"]
          })
          .present();
        break;
    }
  }
  showToast(msg) {
    // this.toast.show(msg, "5000", "bottom").subscribe(toast => {});

    const toast = this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
