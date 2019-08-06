import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { ImageModalPage } from "../image-modal/image-modal";
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertProvider } from '../../providers/alert';
/**
 * Generated class for the CaloriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calories',
  templateUrl: 'calories.html',
})
export class CaloriesPage {

  private user:any;
  private timelineId:string;
  public protein:number;
  public fat:number;
  public carbohydrate:number;
  public calories:number;
  public comment:string;
  public image:string;
  public isExpert:boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public modalCtrl: ModalController,
    public angularDb:AngularFireDatabase,
    public alertProvider: AlertProvider,
    ) {

    this.timelineId = this.navParams.get('timelineId');
  }

  ionViewDidLoad() {

    this.dataProvider.getCurrentUser().subscribe((user) => {

      this.user = user;
      if(user.isExpert == "true") this.isExpert = true;
    });

    this.dataProvider.getTimeline(this.timelineId).subscribe((timeline) => {

      this.image = timeline.image;
      this.protein = timeline.protein;
      this.fat = timeline.fat;
      this.carbohydrate = timeline.carbohydrate;
      this.calories = timeline.calories;
      this.comment = timeline.comment;
    });
  }

  // Enlarge image messages.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }


  postClick() {

    this.angularDb
    .object("/timeline/" + this.timelineId)
    .update({
      protein: this.protein,
      fat: this.fat,
      carbohydrate: this.carbohydrate,
      calories: this.calories,
      comment: this.comment
    })
    .then(success => {

      this.alertProvider.showToast('修改成功');
      this.navCtrl.pop();
    })
    .catch(error => {
      console.log(error);
    });
  }

  runTimeChange($event) {

    // static $protein = 75;
    // static $sugar = 70;
    // static $fat = 45;
    
    this.calories = Math.round(this.protein * 75 + this.fat * 45 + this.carbohydrate * 70 );
    console.log("calories("+this.calories+")");
  // return round($protein * \App\Services\NutriProportion::$protein + $fat * \App\Services\NutriProportion::$fat + $sugar * \App\Services\NutriProportion::$sugar);

  }
}
