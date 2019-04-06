import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { UserProfilePage } from './user-profile';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(UserProfilePage),
  ],
})
export class UserProfilePageModule {}
