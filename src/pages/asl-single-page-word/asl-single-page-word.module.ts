import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { AslSinglePageWordPage } from './asl-single-page-word';

@NgModule({
  declarations: [
    AslSinglePageWordPage,
  ],
  imports: [
    IonicPageModule.forChild(AslSinglePageWordPage),
  ],
})
export class AslSinglePageWordPageModule {}
