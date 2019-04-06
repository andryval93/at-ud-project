import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { ChangePasswordPage } from './change-password';

@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePasswordPage),
  ],
})
export class ChangePasswordPageModule {}
