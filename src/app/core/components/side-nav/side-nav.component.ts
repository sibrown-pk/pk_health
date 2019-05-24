import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  private _isNavToggled: Boolean = true;

  constructor() { }

  menuToggle() {
    this._isNavToggled = !this._isNavToggled;
  }

  ngOnInit() { }
  get isNavToggled() {
    return this._isNavToggled;
  }

}
