import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentRecordPage } from './payment-record';

@NgModule({
  declarations: [
    PaymentRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentRecordPage),
  ],
})
export class PaymentRecordPageModule {}
