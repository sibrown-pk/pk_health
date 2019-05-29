import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { IQLink } from 'src/app/shared/interfaces/ILandingPage';
import { DataManipulators } from 'src/app/shared/helpers/data_manipulators';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  private _quickLinks: Array<IQLink> = [];

  constructor(private _dataService: DataService, private _router: Router) {
    this._dataService.getQuickLinksData().then((res: any) => {
      this._quickLinks = res.map(item => DataManipulators.objectKeysToCamelCase(item));
      console.log(res);

    }).catch(e => {
      console.warn(e);
    });
  }

  ngOnInit() {
  }
  routeTo(path: string) {
    this._router.navigate([path]);
  }

  get quickLinks() {
    return this._quickLinks;
  }


}
