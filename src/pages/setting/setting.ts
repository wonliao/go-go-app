import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { ImageProvider } from "../../providers/image";
import { Camera } from "@ionic-native/camera";
import {AlertProvider} from "../../providers/alert";
import {AngularFireDatabase} from "angularfire2/database";
// import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

 
  private user: any;
  

  public isFirstTime: boolean = false;
  public username: string;
  public birth: string = '';
  public userImage: string = "https://firebasestorage.googleapis.com/v0/b/so88-9ef61.appspot.com/o/profile.png?alt=media";
  public weight: string;
  public height: string;
  public resume: string;    // 個人簡介
  public expectId: string;  // 醫師代碼或名稱


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public dataProvider: DataProvider,
    public imageProvider: ImageProvider,
    public camera: Camera,
    public alertCtrl: AlertController,
    public alertProvider: AlertProvider,
    public angularDb: AngularFireDatabase,
    ) {

      this.isFirstTime = this.navParams.get('isFirstTime');
  }

  ionViewDidLoad() {


    
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    this.dataProvider.getCurrentUser().subscribe((user) => {

      this.loadingProvider.hide();
      this.user = user;

      this.user.img = (this.user.img)? this.user.img: "https://firebasestorage.googleapis.com/v0/b/so88-9ef61.appspot.com/o/profile.png?alt=media";

      if(this.user.isFirstTime == true) this.username = "";
      else                              this.username = this.user.username;

      this.birth = (this.user.birth)?this.user.birth: "";
      this.weight = (this.user.weight)?this.user.weight: "";
      this.height = (this.user.height)?this.user.height: "";
      this.resume = (this.user.resume)?this.user.resume: "";
      this.expectId = (this.user.expectId)?this.user.expectId: "";
    });
  }

  setPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    this.alertCtrl
      .create({
        title: "上傳您的飲食照片",
        message:
          "請問您要拍照上傳或從相簿中選擇?",
        buttons: [
          {
            text: "取消",
            handler: data => {}
          },
          {
            text: "從相簿中選擇",
            handler: () => {
              // Call imageProvider to process, upload, and update user photo.
              this.imageProvider.setProfilePhoto(
                this.user,
                this.camera.PictureSourceType.PHOTOLIBRARY
              );
            }
          },
          {
            text: "拍照",
            handler: () => {
              // Call imageProvider to process, upload, and update user photo.
              this.imageProvider.setProfilePhoto(
                this.user,
                this.camera.PictureSourceType.CAMERA
              );
            }
          }
        ]
      })
      .present();
  }

  submitClick() {

    console.log("img("+this.user.img+")");
    // return;
    this.angularDb
      .object("/accounts/" + this.user.userId)
      .update({
        username: this.username,
        name:  this.username,
        real_name: this.username,
        img: this.user.img,
        birth: this.birth,
        weight: this.weight,
        height: this.height,
        resume: (this.resume)? this.resume: "",
        expectId: (this.expectId)? this.expectId: "",
        isFirstTime: false
      })
      .then(success => {
        
        this.alertProvider.showToast('更新成功');
      
        if(this.isFirstTime) {
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.navCtrl.pop();
        }
      })
      .catch(error => {
        this.alertProvider.showToast('更新失敗，請再試一次');
      });    
  }

}
