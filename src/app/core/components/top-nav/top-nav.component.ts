import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { DataManipulators } from 'src/app/shared/helpers/data_manipulators';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  private _isNavbarOpen: Boolean = false;
  private _isOverlayMenuVisible: Boolean = false;
  private _menuItems = {};
  private _currentOverlayMenuIndex: number = null;
  @HostListener('document:click', ['$event'])
  onOutsideClick(event) {
    if (event) {
      if (!this._elRef.nativeElement.contains(event.target)) {
        this.toggleOverlayMenu(null);
      } else {
        return;
      }
    }
  }

  constructor(private _elRef: ElementRef, private _data: DataService) {
    this._data.getMenuData().then(res => {
      res = res.map(item => DataManipulators.objectKeysToCamelCase(item));
      res = DataManipulators.groupBy(res, 'navItemLabel');
      res = DataManipulators.objectKeysToCamelCase(res);
      for (const r in res) {
        res[r] = DataManipulators.groupBy(res[r], 'linkCategory');
        res[r] = DataManipulators.objectKeysToCamelCase(res[r]);
      }
      this._menuItems = res;
      console.log(this._menuItems);

    }).catch(e => { console.warn(e); });

  }

  ngOnInit() {
  }
  toggleNavbar() {
    this._isNavbarOpen = !this._isNavbarOpen;
  }
  toggleOverlayMenu(i: number) {
    this._currentOverlayMenuIndex = i;
  }
  isOverlayMenuVisible(index) {
    // tslint:disable-next-line: radix
    return this._currentOverlayMenuIndex === parseInt(index);
  }

  getSentenceCase(text: string) {
    return DataManipulators.camelCaseToSentenceCase(text);
  }
  getOverlayItemIconClass(label: string) {
    let iconClass = '';
    label = label.trim().toLowerCase().split(' ').join('');
    switch (label) {
      case 'dashboards':
        iconClass = 'fa-tachometer';
        break;
      case 'explorers':
        iconClass = 'fa-sliders';
        break;
      case 'keyperformanceindicators':
        iconClass = 'fa-pie-chart';
        break;
      default:
        if (label.startsWith('key') || label.indexOf('indicators') > -1) {
          iconClass = 'fa-pie-chart';
        } else if (label.indexOf('explorer') > -1) {
          iconClass = 'fa-sliders';
        } else if (label.indexOf('dashboard') > -1) {
          iconClass = 'fa-tachometer';
        } else {
          iconClass = 'fa-tachometer';
        }
        break;
    }
    return iconClass;
  }
  get isNavbarOpen() {
    return this._isNavbarOpen;
  }
  get menuItems() {
    return this._menuItems;
  }

}
