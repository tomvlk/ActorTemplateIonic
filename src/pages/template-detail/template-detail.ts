import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Project, ActorTemplate } from "../../app/models";
import { TemplateEditPage } from "../template-edit/template-edit";


@Component({
  selector: 'page-template-detail',
  templateUrl: 'template-detail.html'
})
export class TemplateDetailPage {
  private type: string;
  private project: Project;
  private template: ActorTemplate;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
  ) {
    this.type = navParams.data['type'];
    this.project = navParams.data['project'];
    this.template = navParams.data['template'];
  }


  openEditModal() {
    const modal = this.modalCtrl.create(TemplateEditPage, {
      type: 'modal',
      project: this.project,
      template: this.template,
    });
    modal.present();
  }
}
