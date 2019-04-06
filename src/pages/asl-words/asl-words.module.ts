import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { AslWordsPage } from './asl-words';

@NgModule({
  declarations: [
    AslWordsPage,
  ],
  imports: [
    IonicPageModule.forChild(AslWordsPage),
  ],
})
export class AslWordsPageModule {}
