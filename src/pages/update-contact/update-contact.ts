import {Component} from '@angular/core';
import {NavParams, Platform, ViewController} from 'ionic-angular';
import {CountryCodeProvider} from '../../providers/country-code';
import {AngularFireDatabase} from 'angularfire2/database';
import {AlertProvider} from '../../providers/alert';
import {LoadingProvider} from '../../providers/loading';

import {DataProvider} from '../../providers/data';

@Component({
  selector: 'page-update-contact',
  templateUrl: 'update-contact.html'
})

export class UpdateContactPage {
	phoneNumber:any;
	user:any;
	constructor(
		public platform: Platform,
	    public params: NavParams,
	    public loadingProvider: LoadingProvider,
	    public viewCtrl: ViewController,
	    public dataProvider: DataProvider,
	    public alertProvider: AlertProvider,
        public angularDb:AngularFireDatabase,
		public countryCodeProvider: CountryCodeProvider
	){
		this.dataProvider.getCurrentUser().subscribe((user) => {
			this.user = user;
			this.phoneNumber = user.phoneNumber;
		});
	}

	dismiss() {
	    this.viewCtrl.dismiss();
	}

	updateContact(){
		if(this.phoneNumber){

			this.loadingProvider.show();

			this.user.phoneNumber = this.phoneNumber;
			// console.log("進行帳號綁定 ==> phoneNumber("+this.phoneNumber+")");
			this.dataProvider.bindingAccount(this.user, this.phoneNumber).then(() => {

				// console.log("bindingAccount ==> end");

				// 儲存手機號碼
				this.angularDb.object('/accounts/' + this.user.userId).update({
					// countryCode: this.countryCode,
					phoneNumber: this.phoneNumber
				}).then((success) => {

					this.alertProvider.showPhoneNumberUpdatedMessage();
					// this.viewCtrl.dismiss();

				}).catch((error) => {
					this.alertProvider.showErrorMessage('profile/error-update-profile');
				});
			});
		}
	}
}
