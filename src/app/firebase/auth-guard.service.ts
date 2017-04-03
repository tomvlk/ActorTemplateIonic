import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  public loggedIn: boolean;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    this.loggedIn = false;
    this.auth.state.subscribe(auth => this.loggedIn = auth?true:false);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.loggedIn;
  }
}
