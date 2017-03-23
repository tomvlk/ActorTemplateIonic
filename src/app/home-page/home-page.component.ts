import { Component, OnInit } from '@angular/core';
import { AuthService } from '../firebase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public loading = true;

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.auth.state.subscribe(state => {
      this.loading = false;
      if (! state) {
        this.router.navigate(['login']);
      }
    })
  }

}
