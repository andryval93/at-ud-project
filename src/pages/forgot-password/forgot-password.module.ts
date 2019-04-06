import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { ForgotPasswordPage } from './forgot-password';

@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswordPage),
  ],
})
export class ForgotPasswordPageModule {}
