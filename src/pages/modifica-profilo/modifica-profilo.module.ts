import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { ModificaProfiloPage } from './modifica-profilo';

@NgModule({
  declarations: [
    ModificaProfiloPage,
  ],
  imports: [
    IonicPageModule.forChild(ModificaProfiloPage),
  ],
})
export class ModificaProfiloPageModule {}
