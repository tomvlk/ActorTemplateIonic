import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { User } from "../../app/models";


@Component({
  selector: 'page-user-select',
  templateUrl: 'user-select.html'
})
export class UserSelectPage {
  private type: string = 'push';
  private users: FirebaseListObservable<User[]>;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public af: AngularFire,
  ) {
    if (navParams.data.hasOwnProperty('type')) {
      this.type = navParams.data.type;
    }
    this.users = this.af.database.list('/users');
  }

  select(user: User) {
    this.viewCtrl.dismiss({
      user: user
    });
  }

  cancel() {
    this.viewCtrl.dismiss({
      user: null
    });
  }
}
