import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Auth } from "../../providers/auth";

@Component({
  selector: 'page-home-popover',
  templateUrl: 'home-popover.html'
})
export class HomePopoverPage {
  constructor(
    public viewCtrl: ViewController,
    public auth: Auth,
  ) { }

  close() {
    this.viewCtrl.dismiss();
  }
}
