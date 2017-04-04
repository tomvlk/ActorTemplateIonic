import { Component, ViewChild } from '@angular/core';
import { Platform, Menu, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Auth } from "../providers/auth";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  @ViewChild('content') content: NavController;
  @ViewChild(Menu) menu: Menu;

  pages = [
    { title: 'Projects', component: HomePage },
    { title: false, component: false },
    { title: 'Logout', action: 'logout' },
  ];

  lastState:any = null;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private auth: Auth,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    auth.firebase.subscribe(state => {
      this.menu.enable(state !== null);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.hasOwnProperty('component') && page.component) {
      this.content.setRoot(page.component);
      this.menu.close();
    } else if (page.hasOwnProperty('action')) {
      if (page.action === 'logout') {
        this.menu.close();

        setTimeout(() => {
          this.auth.signOut().then(() => {
            return this.content.setRoot(HomePage);
          }).then(() => {
            this.menu.enable(false);
          });
        }, 350);
      }
    }
  }
}
