import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ModalController, ItemSliding } from 'ionic-angular';
import { Project, ActorTemplate, Person } from "../../app/models";
import { TemplateEditPage } from "../template-edit/template-edit";
import { AngularFire, FirebaseListObservable, FirebaseApp } from "angularfire2";
import { PersonSelectPage } from "../person-select/person-select";
import { PersonEditPage } from "../person-edit/person-edit";


@Component({
  selector: 'page-template-detail',
  templateUrl: 'template-detail.html'
})
export class TemplateDetailPage {
  private type: string;
  private project: Project;
  private template: ActorTemplate;

  private persons: Promise<Person[]>;
  private personUids: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public af: AngularFire,
    @Inject(FirebaseApp) public firebaseApp: any,
  ) {
    this.type = navParams.data['type'];
    this.project = navParams.data['project'];
    this.template = navParams.data['template'];

    this.personUids = af.database.list(`/projects/${this.project.$key}/templates/${this.template.$key}/persons`);
    this.personUids.subscribe(memberDict => {
      let promises = [];
      memberDict.forEach(member => {
        promises.push(new Promise((resolve, reject) => {
          let query = this.af.database.object(`/projects/${this.project.$key}/persons/${member.$key}`);
          let sub = query.subscribe(person => {
            if (sub) sub.unsubscribe();
            person.photoPromise = new Promise((resolve, reject) => {
              if (! person.photo) return resolve('assets/img/profile.jpg');
              this.firebaseApp.storage().ref(person.photo).getDownloadURL().then(url => {
                return resolve(url);
              }).catch(err => {
                return resolve('assets/img/profile.jpg');
              });
            });
            return resolve(person);
          });
        }));
      });
      this.persons = Promise.all(promises);
    });
  }

  openAddPerson() {
    const modal = this.modalCtrl.create(PersonSelectPage, {
      type: 'modal',
      project: this.project,
      template: this.template,
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (! data || ! data.person) return;
      const person: Person = data.person;
      this.personUids.update(person.$key, {member: true});
    });
  }

  removePerson(slidingItem: ItemSliding, person: Person) {
    if (slidingItem) slidingItem.close();
    this.personUids.remove(person.$key);
  }

  editPerson(slidingItem: ItemSliding, person: Person) {
    if (slidingItem) slidingItem.close();
    const modal = this.modalCtrl.create(PersonEditPage, {
      type: 'modal',
      project: this.project,
      template: this.template,
      person: person,
    });
    modal.present();
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
