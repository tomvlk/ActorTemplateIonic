import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ItemSliding } from 'ionic-angular';
import { ActorTemplate, Project, Person } from "../../app/models";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { PersonEditPage } from "../person-edit/person-edit";


@Component({
  selector: 'page-person-select',
  templateUrl: 'person-select.html'
})
export class PersonSelectPage {
  private type: string;
  private project: Project;
  private template: ActorTemplate;

  private persons: FirebaseListObservable<Person[]>;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public af: AngularFire,
  ) {
    this.type = navParams.data['type'];
    this.project = navParams.data['project'];
    this.template = navParams.data['template'];

    this.persons = this.af.database.list(`/projects/${this.project.$key}/persons`);
  }

  cancel() {
    this.viewCtrl.dismiss({
      person: null
    });
  }

  select(person: Person) {
    this.viewCtrl.dismiss({
      person: person
    });
  }

  openAddPerson() {
    return this.openEditPerson(null, null);
  }

  openEditPerson(slidingItem: ItemSliding, person: Person) {
    if (slidingItem) slidingItem.close();
    const modal = this.modalCtrl.create(PersonEditPage, {
      type: 'modal',
      project: this.project,
      template: this.template,
      person: person,
    });
    modal.present();
  }
}
