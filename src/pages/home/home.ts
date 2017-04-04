import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavController, Platform, ModalController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Auth } from "../../providers/auth";
import { FirebaseAuthState, AuthProviders, AuthMethods } from "angularfire2";
import { AuthRegisterPage } from "../auth-register/auth-register";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading: Loading;

  public isLoading: boolean = true;
  public isAuthenticated: boolean = false;

  public loginCredentials = {email: 'tom.valk@student.hu.nl', password: 'Welkom01'};

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auth: Auth,
    public storage: Storage,
    public platform: Platform,
  ) {
    this.auth.firebase.subscribe(state => {
      this.isLoading = false;
      this.isAuthenticated = (state !== null);
    });
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Please wait...'
    });
    this.loading.present();
  }

  private hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  public createAccount() {
    this.navCtrl.push(AuthRegisterPage);
  }

  public socialLogin(providerString: string) {
    const provider = providerString === 'facebook' ? AuthProviders.Facebook : AuthProviders.Google;
    return this.auth.signIn(null, provider, AuthMethods.Popup)
      .then(state => this.handleSuccess(state))
      .catch((err: firebase.FirebaseError) => this.handleError(err));
  }

  public login() {
    this.showLoading();
    this.auth.signIn(this.loginCredentials)
      .then(state => this.handleSuccess(state))
      .catch((err: firebase.FirebaseError) => this.handleError(err));
  }

  private handleSuccess(state: FirebaseAuthState) {
    this.hideLoading();
    console.log(state);
  }

  private handleError(err: firebase.FirebaseError) {
    this.hideLoading();
    if (err.code == 'auth/user-not-found') {
      this.alertCtrl.create({
        title: 'Invalid credentials',
        subTitle: 'You provided invalid credentials. Please check your username and password and try again!',
        buttons: ['OK'],
      }).present();
    } else if (err.code === 'auth/network-request-failed') {
      this.alertCtrl.create({
        title: 'Internet access',
        subTitle: 'There is no internet access, try again later.'
      }).present();
    } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
      return; // Silence this error.
    } else {
      this.alertCtrl.create({
        title: 'Service unreachable',
        subTitle: 'Authentication can\'t take place without any contact to the servers. Connect to the internet or try again. ('+err.code+')',
        buttons: ['OK'],
      }).present();
      console.error(err);
    }
  }
}
