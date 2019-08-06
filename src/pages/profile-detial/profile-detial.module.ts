import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileDetialPage } from './profile-detial';

@NgModule({
  declarations: [
    ProfileDetialPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileDetialPage),
  ],
})
export class ProfileDetialPageModule {}
