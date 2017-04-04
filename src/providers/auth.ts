import { Injectable } from '@angular/core';
import {
  AuthProviders, AngularFireAuth, AngularFireDatabase, FirebaseAuthState, AuthMethods, FirebaseObjectObservable
} from 'angularfire2';
import { EmailPasswordCredentials } from "angularfire2/auth";
import { User } from "../app/models";


@Injectable()
export class Auth {
  private authState: FirebaseAuthState;
  private user: FirebaseObjectObservable<User> = new FirebaseObjectObservable();

  public name: string = '';
  public uid: string = '';

  constructor(
    public firebase: AngularFireAuth,
    private db: AngularFireDatabase,
  ) {
    this.firebase.subscribe(state => {
      if (state) {
        this.uid = state.uid;
        this.user = this.db.object(`/users/${state.uid}`);
        this.user.subscribe(user => {
          if (user.hasOwnProperty('name') && user.name) {
            this.name = user.name;
          }
        }, err => {});
      }

      this.authState = state;
      if (state !== null && state.auth !== null) {
        if (state.auth.displayName) {
          this.name = state.auth.displayName;
        } else {
          this.name = state.auth.email;
        }
      }
    });
  }

  public get authenticated(): boolean {
    return this.authState !== null;
  }

  public signIn(
    credentials: EmailPasswordCredentials = null,
    provider: AuthProviders = AuthProviders.Password,
    method: AuthMethods = AuthMethods.Password,
  ): firebase.Promise<FirebaseAuthState> {
    return this.firebase.login(credentials, {
      provider: provider,
      method: method,
    }).then(state => {
      if (state.auth.displayName) {
        this.db.object(`/users/${state.uid}`).update({
          name: state.auth.displayName,
        }).then(() => {
          return Promise.resolve(state);
        }).catch(err => {
          return Promise.reject(err);
        });
      } else {
        return Promise.resolve(state);
      }
    });
  }

  public signOut(): firebase.Promise<void> {
    return this.firebase.logout();
  }

  public register(credentials: EmailPasswordCredentials, name: string): Promise<FirebaseAuthState> {
    return new Promise((resolve, reject) => {
      this.firebase.createUser(credentials).then((auth) => {
        this.db.object(`/users/${auth.uid}`).update({
          name: name
        }).then(() => {
          return resolve(auth);
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    })
  }

  displayName(): string {
    if (this.authState !== null && this.authState.auth !== null) {
      return this.authState.auth.displayName;
    }
    return '';
  }
}
