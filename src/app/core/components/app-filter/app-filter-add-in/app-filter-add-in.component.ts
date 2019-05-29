import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Subscription } from 'rxjs';
import { C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT } from 'src/app/shared/constants/qlik_server_parameters';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { C_ALL_HOSPITAL_KEY } from 'src/app/shared/constants/hsc';
import { IHospitalData } from 'src/app/shared/interfaces/IHsc';

@Component({
  selector: 'app-filter-add-in',
  templateUrl: './app-filter-add-in.component.html',
  styleUrls: ['./app-filter-add-in.component.scss']
})
export class AppFilterAddInComponent implements OnInit, OnDestroy {
  private _currentDivisionFilter = C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT;
  private _defaultDivisionFilter = C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT;

  private _currentHospitalFilter: IHospitalData = this._notification.getHospitalFilterBuffer();
  private _isHscPage = false;

  private subscriptions = new Subscription();

  constructor(private _notification: NotificationService) {

    // Division change subscription
    this.subscriptions.add(
      this._notification.getSelectedDivision().pipe(distinctUntilChanged()).subscribe({
        next: (division: string) => {
          this._currentDivisionFilter = division;
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );

    // Hospital filter change subscription
    this.subscriptions.add(
      this._notification.getHospitalFilter().pipe(distinctUntilChanged()).subscribe({
        next: (hospital: IHospitalData) => {
          this._currentHospitalFilter = hospital;
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
    this.subscriptions.add(
      this._notification.getCurrentRoute().subscribe({
        next: (path: string) => {
          this._isHscPage = path === '/data-cards';
        },
        error: e => {
          console.warn(e);
        }
      })
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  removeCurrentDivisionFilter() {
    if (this._currentDivisionFilter !== this._defaultDivisionFilter) {
      this._currentDivisionFilter = this._defaultDivisionFilter;
      this._notification.sendSelectedDivision(this._currentDivisionFilter);
      this.removeCurrentHospitalFilter();
    }
  }

  removeCurrentHospitalFilter() {
    this._notification.setHospitalFilter({ Division: this._currentDivisionFilter, Hospital: `${this._currentDivisionFilter} - All Hospitals`, isDefault: true });
  }

  get currentDivisionFilter() {
    return this._currentDivisionFilter || this._defaultDivisionFilter;
  }
  get defaultDivisionFilter() {
    return this._defaultDivisionFilter;
  }
  get currentHospitalFilter() {
    return this._currentHospitalFilter;
  }
  get allHospitalKey() {
    return C_ALL_HOSPITAL_KEY;
  }
  get isHscPage() {
    return this._isHscPage;
  }

}
