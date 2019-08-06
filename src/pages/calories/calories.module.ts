import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaloriesPage } from './calories';

@NgModule({
  declarations: [
    CaloriesPage,
  ],
  imports: [
    IonicPageModule.forChild(CaloriesPage),
  ],
})
export class CaloriesPageModule {}
