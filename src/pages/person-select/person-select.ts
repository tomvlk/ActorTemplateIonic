import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ItemSliding } from 'ionic-angular';
import { ActorTemplate, Project, Person } from "../../app/models";
import { AngularFire, FirebaseListObservable, FirebaseApp } from "angularfire2";
import { PersonEditPage } from "../person-edit/person-edit";
import { BehaviorSubject } from "rxjs/BehaviorSubject";


@Component({
  selector: 'page-person-select',
  templateUrl: 'person-select.html'
})
export class PersonSelectPage {
  private type: string;
  private project: Project;
  private template: ActorTemplate;

  private _persons: FirebaseListObservable<Person[]>;
  private persons: BehaviorSubject<Person[]> = new BehaviorSubject([]);

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public af: AngularFire,
    @Inject(FirebaseApp) public firebaseApp: any,
  ) {
    this.type = navParams.data['type'];
    this.project = navParams.data['project'];
    this.template = navParams.data['template'];

    this._persons = this.af.database.list(`/projects/${this.project.$key}/persons`);
    this._persons.subscribe(personList => {
      let finalList: Person[] = [];
      personList.forEach((person: any) => {
        person.photoPromise = new Promise((resolve, reject) => {
          if (! person.photo) return resolve('assets/img/profile.jpg');
          this.firebaseApp.storage().ref(person.photo).getDownloadURL().then(url => {
            return resolve(url);
          }).catch(err => {
            return resolve('assets/img/profile.jpg');
          });
        });
        finalList.push(person);
      });
      this.persons.next(finalList);
    });
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
