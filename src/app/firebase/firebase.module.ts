import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from "angularfire2";
import { AuthGuardService } from "./auth-guard.service";
import { AuthService } from './auth.service';
import { FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG } from '../constants';

@NgModule({
  imports: [
    CommonModule,

    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG),
  ],
  declarations: [

  ],
  providers: [
    AuthService,
    AuthGuardService
  ],
})
export class FirebaseModule { }
