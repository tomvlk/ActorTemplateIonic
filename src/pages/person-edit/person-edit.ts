import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Project, ActorTemplate, Person } from "../../app/models";
import { AngularFire, FirebaseApp } from "angularfire2";
import * as firebase from 'firebase';


@Component({
  selector: 'page-person-edit',
  templateUrl: 'person-edit.html'
})
export class PersonEditPage {
  private type: string;

  private storage: any;
  private loading: Loading;

  private project: Project;
  private person: Person;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public af: AngularFire,
    @Inject(FirebaseApp) firebaseApp: any,
  ) {
    this.type = navParams.data['type'];
    this.project = navParams.data['project'];
    this.person = navParams.data['person'];

    this.storage = firebaseApp.storage();

    if (! this.person) {
      this.person = {name: '', description: '', email: '', function: '', phone: '', photo: ''};
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showError(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{text: 'OK'}]
    }).present();
  }

  save() {
    // Show loader.
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    // Create project.
    let promise = ! this.person.$key ? this.create() : this.update();
    return promise.then((result:any) => {
      if (! this.person.$key) {
        this.person.$key = result.key;
      }
      this.loading.dismiss();
      this.viewCtrl.dismiss();
    }).catch(err => {
      this.loading.dismiss();
      return this.showError('Error', 'Error with saving: ' + err.message);
    });
  }

  update() {
    return this.af.database.object(`/projects/${this.project.$key}/persons/${this.person.$key}`).update(this.person);
  }

  create() {
    return this.af.database.list(`/projects/${this.project.$key}/persons`).push(this.person);
  }
}
