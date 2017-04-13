import { Component } from '@angular/core';

import { NavController, ModalController, LoadingController, Loading, AlertController, PopoverController, ItemSliding } from 'ionic-angular';
import { Auth } from "../../providers/auth";
import { FirebaseAuthState, AuthProviders, AuthMethods, AngularFire } from "angularfire2";
import { AuthRegisterPage } from "../auth-register/auth-register";
import { HomePopoverPage } from "../home-popover/home-popover";
import { Project } from "../../app/models";
import { ProjectEditPage } from "../project-edit/project-edit";
import { FireUtils } from "../../providers/fire-utils";
import { TemplateOverviewPage } from "../template-overview/template-overview";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading: Loading;

  public isAuthenticated: boolean = null;

  public loginCredentials = {email: 'tom.valk@student.hu.nl', password: 'Welkom01'};

  public projectList: Promise<Project[]> = Promise.resolve([]);

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public af: AngularFire,
    public auth: Auth,
    public fireUtils: FireUtils,
  ) {
    this.auth.firebase.subscribe(state => {
      if (this.isAuthenticated !== (state !== null) && state !== null) {
        this.loadList();
      }
      this.isAuthenticated = (state !== null);
    });
  }

  private loadList() {
    let query = this.af.database.list(`/members`);
    let subscribe = query.subscribe(projectMemberships => {
      let promiseList = [];
      for (let membership of projectMemberships) {
        if (! this.auth.uid || ! membership.hasOwnProperty(this.auth.uid)) {
          continue;
        }
        promiseList.push(
          new Promise((resolve, reject) => {
            let subscribe2 = this.af.database.object(`/projects/${membership.$key}`).subscribe(project => {
              if (subscribe2) subscribe2.unsubscribe();
              resolve(project)
            }, err => {
              console.error(err);
              if (subscribe2) subscribe2.unsubscribe();
              let fixQuery = this.af.database.object(`/members/${membership.$key}`);
              let fixSubscribe = fixQuery.subscribe(entry => {
                if (fixSubscribe) fixSubscribe.unsubscribe();
                if (entry.hasOwnProperty(this.auth.uid)) delete entry[this.auth.uid];
                // fixQuery.set(entry);
              });
            });
          })
        );
      }
      this.projectList = Promise.all(promiseList).catch(err => {
        console.error(err);
        window.location.reload();
      });
    }, err => {
      subscribe.unsubscribe();
    });
  }

  public openProject(project: Project) {
    this.navCtrl.push(TemplateOverviewPage, {
      project: project
    });
  }

  public openEditProject(slidingItem: ItemSliding, project: Project) {
    slidingItem.close();
    const modal = this.modalCtrl.create(ProjectEditPage, {
      type: 'modal',
      project: project
    });
    modal.present();
  }

  public removeProject(slidingItem: ItemSliding, project: Project) {
    slidingItem.close();
    this.alertCtrl.create({
      title: 'Delete project?',
      message: 'Are you sure you want to delete the whole project?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: data => {
            this.fireUtils.deleteProject(project);
          }
        }
      ]
    }).present();
  }

  public openAddProject() {
    const modal = this.modalCtrl.create(ProjectEditPage, {
      type: 'modal',
      project: null
    });
    modal.present();
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Please wait...'
    });
    this.loading.present();
  }

  private hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  public showPopover(ev) {
    this.popoverCtrl.create(HomePopoverPage).present({ev: ev});
  }

  public createAccount() {
    this.navCtrl.push(AuthRegisterPage);
  }

  public socialLogin(providerString: string) {
    const provider = providerString === 'facebook' ? AuthProviders.Facebook : AuthProviders.Google;
    return this.auth.signIn(null, provider, AuthMethods.Popup)
      .then(state => this.handleSuccess(state))
      .catch((err: firebase.FirebaseError) => this.handleError(err));
  }

  public login() {
    this.showLoading();
    this.auth.signIn(this.loginCredentials)
      .then(state => this.handleSuccess(state))
      .catch((err: firebase.FirebaseError) => this.handleError(err));
  }

  private handleSuccess(state: FirebaseAuthState) {
    this.hideLoading();
  }

  private handleError(err: firebase.FirebaseError) {
    this.hideLoading();
    if (err.code == 'auth/user-not-found') {
      this.alertCtrl.create({
        title: 'Invalid credentials',
        subTitle: 'You provided invalid credentials. Please check your username and password and try again!',
        buttons: ['OK'],
      }).present();
    } else if (err.code === 'auth/network-request-failed') {
      this.alertCtrl.create({
        title: 'Internet access',
        subTitle: 'There is no internet access, try again later.'
      }).present();
    } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
      return; // Silence this error.
    } else {
      this.alertCtrl.create({
        title: 'Service unreachable',
        subTitle: 'Authentication can\'t take place without any contact to the servers. Connect to the internet or try again. ('+err.code+')',
        buttons: ['OK'],
      }).present();
      console.error(err);
    }
  }
}
