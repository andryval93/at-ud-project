import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { AddSocialPage } from './add-social';

@NgModule({
  declarations: [
    AddSocialPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSocialPage),
  ],
})
export class AddSocialPageModule {}
