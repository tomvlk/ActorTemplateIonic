import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, ModalController, ItemSliding } from 'ionic-angular';
import { Project, ActorTemplate } from "../../app/models";
import { TemplateEditPage } from "../template-edit/template-edit";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { TemplateDetailPage } from "../template-detail/template-detail";


@Component({
  selector: 'page-template-overview',
  templateUrl: 'template-overview.html'
})
export class TemplateOverviewPage {

  private project: Project;
  private templates: FirebaseListObservable<ActorTemplate[]>;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public af: AngularFire,
  ) {
    try {
      this.project = navParams.data.project;
    } catch(err) {
      console.error(err);
      this.alertCtrl.create({title:'Error', message:'Error with opening project!'}).present();
      this.viewCtrl.dismiss();
    }

    this.templates = this.af.database.list(`/projects/${this.project.$key}/templates`);
  }

  openAddTemplate() {
    const modal = this.modalCtrl.create(TemplateEditPage, {
      type: 'modal',
      project: this.project,
      template: null,
    });
    modal.present();
  }

  openEditTemplate(slidingItem: ItemSliding, template: ActorTemplate) {
    if (slidingItem) slidingItem.close();
    const modal = this.modalCtrl.create(TemplateEditPage, {
      type: 'modal',
      project: this.project,
      template: template,
    });
    modal.present();
  }

  openTemplate(slidingItem: ItemSliding, template: ActorTemplate) {
    if (slidingItem) slidingItem.close();
    this.navCtrl.push(TemplateDetailPage, {
      type: 'push',
      project: this.project,
      template: template
    });
  }

  archiveTemplate(slidingItem: ItemSliding, template: ActorTemplate) {
    if (slidingItem) slidingItem.close();
    template.archived = true;
    this.af.database.object(`/projects/${this.project.$key}/templates/${template.$key}`).update(template);
  }

}
