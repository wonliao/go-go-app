import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from "../../providers/data";
import { LoadingProvider } from "../../providers/loading";

/**
 * Generated class for the ProfileDetialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-detial',
  templateUrl: 'profile-detial.html',
})
export class ProfileDetialPage {
  
  // private user: any;
  public timelineData: any;

  constructor(
    public navCtrl: NavController, 
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileDetialPage');

    this.getTimeline();
  }

  getTimeline() {
    
    this.dataProvider.getTimelines().subscribe((timelineIds) => {

      if (timelineIds.length > 0) {
      
        this.loadingProvider.hide();
        this.timelineData = []
        timelineIds.forEach((timelineId) => {

          this.dataProvider.getTimeline(timelineId.$value).subscribe((timeline) => {

            if (timeline.$exists()) {

              let tempData = <any>{};
              tempData = timeline;
              // this.dataProvider.getUser(timeline.postBy).subscribe((user) => {
              //   tempData.avatar = user.img;
              //   tempData.name = user.name
              // });
              // this.addOrUpdateTimeline(tempData)

              var date = new Date(tempData.dateCreated);
              tempData.years = date.getFullYear();
              tempData.months = date.getMonth() + 1;
              tempData.days = date.getDate();
              tempData.hours = date.getHours();
              tempData.minutes = date.getMinutes();


              this.timelineData.unshift(tempData);
            }
          })
        })
      } else {
        this.timelineData = [];
        this.loadingProvider.hide();
      }
    })
  }


}
