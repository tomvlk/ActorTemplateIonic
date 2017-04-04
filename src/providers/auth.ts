import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { EmailPasswordCredentials } from "angularfire2/auth";


@Injectable()
export class Auth {
  private authState: FirebaseAuthState;

  public name: string = '';

  constructor(
    public firebase: AngularFireAuth,
  ) {
    this.firebase.subscribe(state => {
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
    });
  }

  public signOut(): firebase.Promise<void> {
    return this.firebase.logout();
  }

  public register(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
    return this.firebase.createUser(credentials)
  }

  displayName(): string {
    if (this.authState !== null && this.authState.auth !== null) {
      return this.authState.auth.displayName;
    }
    return '';
  }
}
