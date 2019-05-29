import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT } from 'src/app/shared/constants/qlik_server_parameters';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { C_ALL_HOSPITAL_KEY, C_DEFAULT_HOSPITAL_FITLER_SELECTION } from 'src/app/shared/constants/hsc';
import { IHospitalData } from 'src/app/shared/interfaces/IHsc';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {

  private subscriptions = new Subscription();
  private currentRoute = new BehaviorSubject(null);
  private _currentRoute = this.currentRoute.asObservable();
  private currentRouteBuffer = null;

  private filterPanelToggle: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private $filterPanelToggle: Observable<boolean> = this.filterPanelToggle.asObservable();
  private _filterPanelBuffer = false;

  private selectedDivision: BehaviorSubject<string> = new BehaviorSubject(C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT);
  private $selectedDivision: Observable<string> = this.selectedDivision.asObservable();
  private _selectedDivisionBuffer: string = C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT;

  private selectedHospital: BehaviorSubject<IHospitalData> = new BehaviorSubject({ Division: C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT, Hospital: C_DEFAULT_HOSPITAL_FITLER_SELECTION, isDefault: true });
  private $selectedHospital: Observable<IHospitalData> = this.selectedHospital.asObservable();
  private _selectedHospitalBuffer: IHospitalData = { Division: C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT, Hospital: C_DEFAULT_HOSPITAL_FITLER_SELECTION, isDefault: true };

  constructor(private _router: Router) {
    this.subscriptions.add(
      this._router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe({
        next: (res: NavigationEnd) => {
          this.currentRoute.next(res.url);
          this.currentRouteBuffer = res.url;
        },
        error: e => { console.warn(e); }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getCurrentRoute() {
    return this._currentRoute;
  }

  getCurrentRouteBuffer() {
    return this.currentRouteBuffer;
  }

  toggleFilterPanel(bool: boolean) {
    this.filterPanelToggle.next(bool);
    this._filterPanelBuffer = bool;
  }

  public filterPanelStatus(): Observable<boolean> {
    return this.$filterPanelToggle;
  }
  getCurrentStatusOfFilterPanel() {
    return this._filterPanelBuffer;
  }

  sendSelectedDivision(division: string) {
    this.selectedDivision.next(division);
    this._selectedDivisionBuffer = division;
  }

  getSelectedDivision() {
    return this.$selectedDivision;
  }
  getSelectedDivisionBuffer() {
    return this._selectedDivisionBuffer;
  }

  setHospitalFilter(hospital: IHospitalData) {

    hospital = hospital !== null ? hospital : {
      Division: this._selectedDivisionBuffer,
      Hospital: `${this._selectedDivisionBuffer} - All Hospitals`,
      isDefault: true
    };
    this.selectedHospital.next(hospital);
    this._selectedHospitalBuffer = hospital;

  }

  getHospitalFilter() {
    return this.$selectedHospital;
  }

  getHospitalFilterBuffer() {
    return this._selectedHospitalBuffer;
  }

}
