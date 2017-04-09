import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { Auth } from "../../providers/auth";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { ActorTemplate, Project, Person } from "../../app/models";


@Component({
  selector: 'page-template-edit',
  templateUrl: 'template-edit.html'
})
export class TemplateEditPage {

  private type: string;
  private template: ActorTemplate;
  private project: Project;

  private loading: Loading;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public auth: Auth,
    public af: AngularFire,
  ) {
    this.project = navParams.data.project;
    this.type = navParams.data.type;
    this.template = navParams.data.template;

    if (! this.template) {
      this.template = {name: '', description: '', archived: false};
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
    let promise = ! this.template.$key ? this.create() : this.update();
    return promise.then((result:any) => {
      if (! this.template.$key) {
        this.template.$key = result.key;
      }
      this.loading.dismiss();
      this.viewCtrl.dismiss();
    }).catch(err => {
      this.loading.dismiss();
      return this.showError('Error', 'Error with saving: ' + err.message);
    });
  }

  update() {
    return this.af.database.object(`/projects/${this.project.$key}/templates/${this.template.$key}`).update(this.template);
  }

  create() {
    return this.af.database.list(`/projects/${this.project.$key}/templates`).push(this.template);
  }
}
