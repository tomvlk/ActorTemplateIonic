import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { Project, User } from "../../app/models";
import { Auth } from "../../providers/auth";
import { AngularFire } from "angularfire2";
import { UserSelectPage } from "../user-select/user-select";

@Component({
  selector: 'page-project-edit',
  templateUrl: 'project-edit.html'
})
export class ProjectEditPage {
  private type: string = 'push';
  private project: Project = null;
  private members: User[];
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
    if (navParams.data.hasOwnProperty('type')) {
      this.type = navParams.data.type;
    }
    if (navParams.data.hasOwnProperty('project')) {
      this.project = navParams.data.project;
    }

    if (! this.project) {
      this.project = {name: '', description: '', members: {}};
      this.project.members[this.auth.uid] = 'analyst';
    }

    this.members = [];
    this.indexMembers();
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

  addMember() {
    // Check permission.
    if (! this.project.members[this.auth.uid] || this.project.members[this.auth.uid] !== 'analyst') {
      return this.showError('Error', 'You don\'t have the Analyst role for this project!');
    }

    // Show member select modal.
    const modal = this.modalCtrl.create(UserSelectPage, {
      type: 'modal'
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (! data || ! data.user) return;
      const user: User = data.user;

      // Check if we have validated content.
      if (user.$key === this.auth.uid) {
        return this.showError('Error', 'You can not add or change yourself!');
      }
      if (this.project.members[user.$key]) {
        return this.showError('Error', 'This user is already a member!');
      }

      // Add user.
      if (! this.project.members) this.project.members = {};
      if (! this.project.members[user.$key]) this.project.members[user.$key] = {};

      this.project.members[user.$key] = 'member';
      this.indexMembers();
    });
  }

  indexMembers() {
    let members = [];
    let promises = [];
    for (let uid of Object.keys(this.project.members)) {
      promises.push(new Promise((resolve, reject) => {
        const query = this.af.database.object(`/users/${uid}`);
        const subscription = query.subscribe(user => {
          if (subscription) subscription.unsubscribe();

          user.role = this.project.members[uid];
          members.push(user);
          resolve(user);
        }, error => {
          if (subscription) subscription.unsubscribe();

          resolve(null);
        });
      }));
    }
    return Promise.all(promises).then(() => {
      this.members = members;
    });
  }

  toggleRole(user: any) {
    // Check permission.
    if (! this.project.members[this.auth.uid] || this.project.members[this.auth.uid] !== 'analyst') {
      return this.showError('Error', 'You don\'t have the Analyst role for this project!');
    }
    if (user.$key === this.auth.uid) {
      return this.showError('Error', 'You can\'t edit your own membership!');
    }

    if (user.role === 'analyst') {
      user.role = 'member';
    } else {
      user.role = 'analyst';
    }
    setTimeout(() => {
      this.project.members[user.$key] = user.role;
      this.indexMembers();
    }, 200);
  }

  removeMember(user: any) {
    // Check permission.
    if (! this.project.members[this.auth.uid] || this.project.members[this.auth.uid] !== 'analyst') {
      return this.showError('Error', 'You don\'t have the Analyst role for this project!');
    }
    if (user.$key === this.auth.uid) {
      return this.showError('Error', 'You can\'t edit your own membership!');
    }

    setTimeout(() => {
      delete this.project.members[user.$key];
      this.indexMembers();
    }, 200);
  }

  save() {
    // Validate permissions.
    if (! this.project.members[this.auth.uid] || this.project.members[this.auth.uid] !== 'analyst') {
      return this.showError('Error', 'You don\'t have the Analyst role for this project!');
    }

    // Show loader.
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    // Create project.
    const projects = this.af.database.list('/projects');
    return projects.push(this.project).then(result => {
      this.project.$key = result.key;

      // Add project id to users.
      let promises = [];
      Object.keys(this.project.members).forEach(key => {
        let payload = {};
        payload[result.key] = true;
        promises.push(this.af.database.object(`/users/${key}/projects`).update(payload));
      });
      Promise.all(promises).then(() => {
        this.loading.dismiss();
        this.viewCtrl.dismiss();
        return Promise.resolve(this.project);
      }).catch(err => {
        this.loading.dismiss();
        return this.showError('Error', 'Error with saving: ' + err.message);
      });
    }).catch(err => {
      this.loading.dismiss();
      return this.showError('Error', 'Error with saving: ' + err.message);
    });
  }
}
