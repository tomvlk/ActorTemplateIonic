import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../firebase/auth.service';
import { MdIconRegistry } from "@angular/material";
import { AuthProviders } from "angularfire2";

@Component({
  selector: 'app-login-page',
  templateUrl: 'login-page.component.html',
  styleUrls: ['login-page.component.css'],
  viewProviders: [MdIconRegistry],
})
export class LoginPageComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router,
    private mdIconRegistry: MdIconRegistry,
  ) {
    mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

  ngOnInit() {
    this.auth.state.subscribe(auth => auth && this.router.navigate(['']));
  }

  public login(provider:AuthProviders) {
    this.auth.login(provider);
  }
}
