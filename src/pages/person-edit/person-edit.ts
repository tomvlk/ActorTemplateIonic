import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Loading, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { Project, ActorTemplate, Person } from "../../app/models";
import { AngularFire, FirebaseApp } from "angularfire2";
import * as firebase from 'firebase';
import { ImagePicker } from "@ionic-native/image-picker";
import { Camera } from "@ionic-native/camera";



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
  private personImageURL: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    public af: AngularFire,
    public camera: Camera,
    public platform: Platform,
    public imagePicker: ImagePicker,
    @Inject(FirebaseApp) firebaseApp: any,
  ) {
    this.type = navParams.data['type'];
    this.project = navParams.data['project'];
    this.person = navParams.data['person'];

    this.storage = firebaseApp.storage();

    if (! this.person) {
      this.person = {name: '', description: '', email: '', function: '', phone: '', photo: ''};
    } else {
      if (this.person.photo && this.person.photo.startsWith('persons/')) {
        this.storage.ref().child(this.person.photo).getDownloadURL().then(url => {
          this.personImageURL = url;
        }).catch(err => {
          console.error(err);
          this.personImageURL = null;
        });
      }
    }
  }

  openChangePicture() {
    const sheet = this.actionSheetCtrl.create({
      title: 'Replace picture',
      buttons: [
        {
          text: 'Take photo',
          handler: () => {this.takePicture();},
        },
        {
          text: 'Select photo',
          handler: () => {this.selectPicture()},
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    sheet.present();
  }

  takePicture() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }).then(imageData => {
      this.personImageURL = 'data:image/jpeg;base64,' + imageData;
    }).catch(err => {
      if (err.message == 'Camera cancelled.') {
        return;
      }
      console.error(err);
      this.showError('Camera error', 'Can\'t take a picture. Error: ' + err.message);
    });
  }

  selectPicture() {
    var promise;
    if (this.platform.is('android')) {
      promise = this.imagePicker.hasReadPermission().then(perm => {
        if (! perm) return this.imagePicker.requestReadPermission();
        return Promise.resolve();
      });
    } else {
      promise = Promise.resolve();
    }
    promise.then(() => {
      return this.imagePicker.getPictures({
        maximumImagesCount: 1,
        outputType: 1
      });
    }).then((imageData: any) => {
      if (imageData && imageData.length > 0) {
        this.personImageURL = 'data:image/jpeg;base64,' + imageData[0];
      }
    }).catch(err => {
      console.error(err);
      this.showError('Camera error', 'Can\'t select a picture. Error: ' + err.message);
    });
  }

  uploadPhoto() {
    if (! this.person.$key) {
      return Promise.resolve();
    }
    return this.storage.ref().child(`persons/${this.person.$key}`).putString(this.personImageURL, 'data_url');
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
      if (this.personImageURL && this.personImageURL.startsWith('data:')) {
        this.loading.setContent('Uploading...');
        return this.uploadPhoto().then(() => {
          this.person.photo = 'persons/' + this.person.$key;
          return this.update();
        });
      }
      return Promise.resolve();
    }).then(() => {
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
