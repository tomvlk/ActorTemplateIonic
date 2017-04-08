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
import { FireUtils } from "../providers/fire-utils";

import { AuthForgotPage } from "../pages/auth-forgot/auth-forgot";
import { AuthRegisterPage } from "../pages/auth-register/auth-register";
import { HomePopoverPage } from "../pages/home-popover/home-popover";
import { ProjectEditPage } from "../pages/project-edit/project-edit";
import { UserSelectPage } from "../pages/user-select/user-select";
import { TemplateOverviewPage } from "../pages/template-overview/template-overview";
import { TemplateEditPage } from "../pages/template-edit/template-edit";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AuthRegisterPage,
    AuthForgotPage,
    HomePopoverPage,
    ProjectEditPage,
    UserSelectPage,
    TemplateOverviewPage,
    TemplateEditPage,
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
    ProjectEditPage,
    UserSelectPage,
    TemplateOverviewPage,
    TemplateEditPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    Auth,
    FireUtils,
  ]
})
export class AppModule {}
