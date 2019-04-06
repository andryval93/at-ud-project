import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { FirstPage } from './firstPage';

@NgModule({
  declarations: [
    FirstPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstPage),
  ],
})
export class FirstPageModule {}
