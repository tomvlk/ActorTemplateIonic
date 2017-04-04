import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AngularFireModule } from 'angularfire2';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { firebaseConfig } from './app.constants';

import { Auth } from "../providers/auth";
import { AuthForgotPage } from "../pages/auth-forgot/auth-forgot";
import { AuthRegisterPage } from "../pages/auth-register/auth-register";
import { HomePopoverPage } from "../pages/home-popover/home-popover";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AuthRegisterPage,
    AuthForgotPage,
    HomePopoverPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AuthRegisterPage,
    AuthForgotPage,
    HomePopoverPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    Auth,
  ]
})
export class AppModule {}
