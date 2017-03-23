import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import {Subject} from "rxjs";

@Injectable()
export class AuthService {

  public state: Subject<FirebaseAuthState> = new Subject();

  constructor(
    private af: AngularFire
  ) {
    this.af.auth.subscribe(auth => {
      this.state.next(auth);
    });
  }

  public login (
    provider: AuthProviders = AuthProviders.Google,
    method: AuthMethods = AuthMethods.Popup)
  {
    this.af.auth.login({
      provider,
      method
    });
  }
}
