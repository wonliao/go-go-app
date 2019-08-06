// TODO: 需要做節省 firebase query 

import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { DataProvider } from "../../providers/data";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Chart } from 'chart.js';
import * as firebase from "firebase";
import { ProfileDetialPage } from '../profile-detial/profile-detial';
import { SettingPage } from "../setting/setting";
import {ImageProvider} from "../../providers/image";
import {Camera} from "@ionic-native/camera";
import { SideMenuPage } from '../side-menu/side-menu';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private alert;
  private user: any;
  private userId: string = "";
  private information: string;
  private targetWeight: string;
  @ViewChild('weightCanvas') weightCanvas;
  @ViewChild('bfpCanvas') bfpCanvas;
  @ViewChild('calorieCanvas') calorieCanvas;
  @ViewChild('bloodPressureCanvas') bloodPressureCanvas;

  // weightChart: any;
  // bfpChart: any;
  // calorieChart: any;
  // bloodPressureChart: any;

  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    private iab: InAppBrowser,
    public alertCtrl: AlertController,
    public imageProvider: ImageProvider,
    public camera: Camera,
    public modalCtrl: ModalController,
    public navParams: NavParams) {

      if(this.navParams.get('userId')) {
        this.userId = this.navParams.get('userId');
      }
      console.log("ProfilePage ==> userId("+this.userId+")");
  }

  ionViewDidLoad() {

    if(this.userId == "") {
      
      let that = this;
      this.dataProvider.getCurrentUser().take(1).subscribe(user => {

        that.information = "weight";
        that.user = user;

        that.dataProvider.getLastWeightData(that.user.userId).take(1).subscribe(list => {

          let text = "0 KG";
          if(list.length > 0) {

            let diff = list[0].weight - this.user.weight;
            if(diff > 0)  text = "+ ";
            else          text = "- ";
  
            text += diff + " KG";
          }
          
          this.targetWeight = text;
        });

        this.user.photosCount = (user.photosCount)? user.photosCount: 0;
        this.user.followerCount = (user.followerCount)? user.followerCount: 0;
        this.user.followingCount = (user.followingCount)? user.followingCount: 0;
        
        console.log("getCurrentUser user ==>");
        console.log(this.user);
      });
    } else {

      this.dataProvider.getUser(this.userId).subscribe(user => {

        this.information = "weight";
        this.user = <any>user;
        console.log("getUser user ==>");
        console.log(this.user);
      });
    }


    // 預設顯示 體重圖表
    // 依類別顯示圖表 (體重/卡路里/血壓)
    var that = this;
    setTimeout(function () {
      that.showChartByType('weight', 7);
    }, 500);
  }

  // 依類別顯示圖表 (體重/卡路里/血壓)
  showChartByType(type: string, days: number) {

    var nowdate: Date = new Date();

    // 顯示週
    if(days == 7) {

      var day = nowdate.getDay(),
      diff = nowdate.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      var WeekFirstDay:any = new Date(nowdate.setDate(diff));
      var WeekLastDay:any = new Date((WeekFirstDay/1000+6*86400)*1000);
      // console.log("WeekFirstDay("+WeekFirstDay+") WeekLastDay("+WeekLastDay+")");
      var startAt:string = WeekFirstDay.toISOString();
      var endAt:string = WeekLastDay.toISOString();
    // 顯示月
    } else if(days == 30) {
      
      var MonthFirstDay:any = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
      var day1:any = new Date(nowdate.getFullYear(), nowdate.getMonth()+1, 1);
      var MonthLastDay:any = new Date(day1-86400000);
      // console.log("MonthFirstDay("+MonthFirstDay+") MonthLastDay("+MonthLastDay+")");
      var startAt:string = MonthFirstDay.toISOString();
      var endAt:string = MonthLastDay.toISOString();
    // 顯示年
    } else if(days == 365) {

      var YearFirstDay:any = new Date(nowdate.getFullYear(), 0, 1);
      var day1:any = new Date(nowdate.getFullYear()+1, 0, 1);
      var YearLastDay:any = new Date(day1-86400000);
      // console.log("YearFirstDay("+YearFirstDay+") YearLastDay("+YearLastDay+")");
      var startAt:string = YearFirstDay.toISOString();
      var endAt:string = YearLastDay.toISOString();
    }
    

    
    // var startDate = new Date(nowdate.getTime() - Math.floor(days * 24 * 3600 * 1000));
    // var startAt = startDate.toISOString(); //"2019-05-04T03:28:26.000Z";
    // var endAt = nowdate.toISOString();
    console.log("startAt ==>" + startAt);
    console.log("endAt ==>" + endAt);

    if (type == "weight") {

      // 產生體重圖表
      this.createWeightChart(startAt, endAt);
    }
  }

  // 產生體重圖表
  createWeightChart(startAt: string, endAt: string) {

    this.dataProvider.getWeightData(
      // firebase.auth().currentUser.uid,
      this.user.userId,
      startAt,
      endAt
    ).subscribe(list => {

      var titleData: Array<string> = [];
      var valueData: Array<number> = [];

      list.forEach(data => {
        var date = new Date(data.dateCreated);
        titleData.push(Math.floor(Math.floor(date.getMonth()) + 1) + "/" + date.getDate());
        if (data.weight != null) valueData.push(data.weight);
      });
      console.log(titleData);
      console.log(valueData);

      var max = Math.max.apply(null, valueData) + 1;
      var min = Math.min.apply(null, valueData) - 1;

      // 繪製圖表 begin
      // this.weightChart = 
      new Chart(this.weightCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: titleData,
          yAxisID: 75,
          datasets: [{
            label: '體重',
            data: valueData,
            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                max: max,
                min: min,
              }
            }]
          }
        }
      });
      // 繪製圖表 end
    });
  }

  chartBtnClick(type: string, days: number) {

    console.log("chartBtnClick => type(" + type + ") days(" + days + ")");
    this.showChartByType(type, days);
  }

  infoBtnClick(type: string) {

    // 預設顯示週
    this.showChartByType(type, 7);
  }

  // TODO: 需要做節省 firebase query 
  // updateChart(type: string, source: any) {
  //     var chart = this.myChart.config;
  //     chart.data.labels = this.titleData;

  //     if (type == "weight") {
  //       chart.data.datasets[0].label = '體重';
  //       chart.data.datasets[0].data = this.valueData;
  //     } else if (type == "calorie") {
  //       chart.data.datasets[0].label = '卡路里';
  //       chart.data.datasets[0].data = this.valueData;
  //     } else if (type == "bloodPressure") {
  //       chart.data.datasets[0].label = '收縮壓';
  //       chart.data.datasets[0].data = this.valueData;

  //       chart.data.datasets[1].label = '舒張壓';
  //       chart.data.datasets[1].data = this.valueData1;
  //     }

  //     chart.options.scales.yAxes[0].ticks.max = max;
  //     chart.options.scales.yAxes[0].ticks.min = min;
  //     this.myChart.update();
  // }

  
  openProfileDetial() {
    this.navCtrl.push(ProfileDetialPage);
  }

  openSettingPage() {
    this.navCtrl.push(SettingPage);
  }

  openSideMenuPage() {
    // this.navCtrl.push(SideMenuPage);
    const modal = this.modalCtrl.create(SideMenuPage);
    modal.present();
  }

  // openOfficialWebsite() {
  //   this.iab.create('https://tw.wen8health.com/');
  // }

  setPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    this.alert = this.alertCtrl
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
}
