import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { LisSinglePageAlphabetPage } from './lis-single-page-alphabet';

@NgModule({
  declarations: [
    LisSinglePageAlphabetPage,
  ],
  imports: [
    IonicPageModule.forChild(LisSinglePageAlphabetPage),
  ],
})
export class LisSinglePageAlphabetPageModule {}
