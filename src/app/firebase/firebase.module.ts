import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from "angularfire2";
import { FIREBASE_CONFIG } from '../constants';

@NgModule({
  imports: [
    CommonModule,

    AngularFireModule.initializeApp(FIREBASE_CONFIG),
  ],
  declarations: []
})
export class FirebaseModule { }
