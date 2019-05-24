import { Component, OnDestroy } from '@angular/core';
import { NotificationService } from './core/services/notification.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'PK Health';
  private _filterPanelToggleStatus = false;
  private _isVisible = false;
  private subcriptions = new Subscription();
  constructor(private _notification: NotificationService, private _router: Router) {
    this.subcriptions.add(
      this._notification.filterPanelStatus().subscribe({
        next: (bool: boolean) => {
          this._filterPanelToggleStatus = bool;
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
    this.subcriptions.add(
      this._router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      ).subscribe({
        next: (event: NavigationEnd) => {
          this._isVisible = event.url === '/' || event.url === '/home' || event.urlAfterRedirects === '/home'
            ? false
            : true;

        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
  }

  // life-cycle hooks below
  ngOnDestroy() {
    this.subcriptions.unsubscribe();
  }
  // methods below
  toggleFilterPanel() {
    this._notification.toggleFilterPanel(true);
  }

  // static methods below
  get filterPanelToggleStatus() {
    return this._filterPanelToggleStatus;
  }

  get isVisible() {
    return this._isVisible;
  }
}
