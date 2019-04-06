import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { SpeechPage } from './speech';

@NgModule({
  declarations: [
    SpeechPage,
  ],
  imports: [
    IonicPageModule.forChild(SpeechPage),
  ],
})
export class SpeechPageModule {}
