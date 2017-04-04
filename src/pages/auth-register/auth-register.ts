import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Auth } from "../../providers/auth";

@Component({
  selector: 'page-auth-register',
  templateUrl: 'auth-register.html'
})
export class AuthRegisterPage {

  public registerCredentials = {email: '', password: '', name: ''};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public auth: Auth,
  ) { }

  public register() {
    this.auth.register({email: this.registerCredentials.email, password: this.registerCredentials.password}, this.registerCredentials.name)
      .then(state => {
        this.navCtrl.popToRoot();
      })
      .catch((err: firebase.FirebaseError) => {
        if (err.code === 'auth/weak-password') {
          this.alertCtrl.create({
            title: 'Weak Password',
            subTitle: err.message
          }).present();
        } else if (err.code === 'auth/network-request-failed') {
          this.alertCtrl.create({
            title: 'Internet access',
            subTitle: 'There is no internet access, try again later.'
          }).present();
        } else {
          console.error(err);
        }
      });
  }
}
