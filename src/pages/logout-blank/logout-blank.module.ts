import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoutBlankPage } from './logout-blank';

@NgModule({
  declarations: [
    LogoutBlankPage,
  ],
  imports: [
    IonicPageModule.forChild(LogoutBlankPage),
  ],
})
export class LogoutBlankPageModule {}
