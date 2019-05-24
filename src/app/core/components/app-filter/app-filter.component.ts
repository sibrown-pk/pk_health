import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { DataManipulators } from 'src/app/shared/helpers/data_manipulators';
import { BreakpointService } from '../../services/breakpoint.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { MHscHospitalData } from 'src/app/shared/models/HSC';
import { C_ALL_HOSPITAL_KEY } from 'src/app/shared/constants/hsc';
import { C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT, C_QLIK_APP_FILTER_DIMENSION_DEFAULT } from 'src/app/shared/constants/qlik_server_parameters';

@Component({
  selector: 'app-filter',
  templateUrl: './app-filter.component.html',
  styleUrls: ['./app-filter.component.scss']
})
export class AppFilterComponent implements OnInit, AfterViewInit, OnDestroy {

  private _isFilterPanelToggled = false;
  private _hospitalKPIData = [];
  private _hospitalData = [];
  // private _selectedFilterParams: Array<string> = [];
  private _currWindowWidth: number = null;
  private _openTabGroup: number = null;
  private subscriptions = new Subscription();
  private _lommDivisions: Array<string> = [];
  private _isHscPage = false;
  private _currentSelectedDivision: string = this._notification.getSelectedDivisionBuffer() || C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT;
  private hscDataDivisionGrouped = null;
  private _allHospitalData = [];
  private _hospitalFilterDivisionPillVisible = true;
  private _currentSelectedHospital = this._notification.getHospitalFilterBuffer();
  private _defaultSelectedHospital = { Division: C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT, Hospital: C_ALL_HOSPITAL_KEY };
  public searchText = '';

  // @HostListener('document:click', ['$event'])
  // onOutsideClick(event) {
  //   if (!this._elRef.nativeElement.contains(event.target) && !document.querySelector('#filter-btn-placeholder').contains(event.target)) {
  //     this.toggleTabGroup(null);
  //   } else {
  //     return;
  //   }
  // }

  constructor(private _notification: NotificationService, private _data: DataService, private _breakpoint: BreakpointService) {

    Promise.all([this._data.getHosiptalKPIData(), this._data.getLommData()]).then(([hscData, lommData]) => {
      this._hospitalKPIData = JSON.parse(JSON.stringify(hscData));
      console.log('All Hospital Names', this._allHospitalData);
      this.hscDataDivisionGrouped = DataManipulators.groupBy(hscData, C_QLIK_APP_FILTER_DIMENSION_DEFAULT);
      this.processHospitalNames(this._hospitalKPIData, this.hscDataDivisionGrouped[this._currentSelectedDivision]);

      lommData = DataManipulators.groupBy(lommData, 'QuaterData');
      lommData = lommData['LOMM'] || [];
      try {
        this._lommDivisions = Array.from(new Set([...lommData.map((key) => key.Division.trim()), ...Object.keys(this.hscDataDivisionGrouped).map((key) => key.trim()).filter(key => key !== '')]));

      } catch (e) {
        console.warn(e);
        this._lommDivisions = [];
      }

    }).catch(e => { console.warn(e); });
  }

  ngOnInit() {
    this._isHscPage = this._notification.getCurrentRouteBuffer() === '/hsc';

    // Division change subscription
    this.subscriptions.add(
      this._notification.getSelectedDivision().pipe(distinctUntilChanged()).subscribe({
        next: (division: string) => {
          this._currentSelectedDivision = division;
          console.log('current selected Division', division);
          this._hospitalFilterDivisionPillVisible = true;
          if (this.hscDataDivisionGrouped !== null) {
            this.processHospitalNames(this._hospitalKPIData, this.hscDataDivisionGrouped[this._currentSelectedDivision]);
          }
        },
        error: (e) => { console.warn(e); }
      })
    );
    // Hospital Filter Change Subscription
    this.subscriptions.add(
      this._notification.getHospitalFilter().subscribe({
        next: (res) => {
          this._currentSelectedHospital = res;
          // if (res === null) {
          //   this._currentSelectedHospital = null;
          // }
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
    this.subscriptions.add(
      this._notification.filterPanelStatus().subscribe({
        next: (bool: boolean) => {
          this._isFilterPanelToggled = bool;
          console.log('this._isFilterPanelToggled', bool);
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
    this.subscriptions.add(
      this._notification.getCurrentRoute().subscribe({
        next: (path: string) => {
          this._isHscPage = path === '/hsc';
        },
        error: e => {
          console.warn(e);
        }
      })
    );
  }
  ngAfterViewInit() {
    this._currWindowWidth = this._breakpoint.getWindowSize.width;
    this.subscriptions.add(
      this._breakpoint.getCurrentWindowWidth().subscribe({
        next: (width: number) => {
          this._currWindowWidth = width;
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  processHospitalNames(fullData, groupedData) {
    let currObj = null;
    const currDivisionHospitalData = [];
    const allHospitalData = [];
    try {
      groupedData
        .map(i => JSON.parse(JSON.stringify(new MHscHospitalData(i))))
        .forEach(element => {
          element.Hospital = element.Hospital === C_ALL_HOSPITAL_KEY ? `${element.Division} - All Hospitals` : element.Hospital;
          if (currDivisionHospitalData.every(k => k.Hospital !== currObj.Hospital)) {
            currDivisionHospitalData.push(element);
          }
          currObj = element;
        });
      this._hospitalData = JSON.parse(JSON.stringify(currDivisionHospitalData.sort((a, b) => a.Hospital.toLowerCase() < b.Hospital.toLowerCase() ? -1 : 1)));
      currObj = null;

      fullData
        .map(i => JSON.parse(JSON.stringify(new MHscHospitalData(i))))
        .forEach(element => {
          element.Hospital = element.Hospital === C_ALL_HOSPITAL_KEY ? `${element.Division} - All Hospitals` : element.Hospital;
          if (allHospitalData.every(k => k.Division !== currObj.Division || k.Hospital !== currObj.Hospital)) {
            allHospitalData.push(element);
          }
          currObj = element;
        });
      this._allHospitalData = JSON.parse(JSON.stringify(allHospitalData.sort((a, b) => a.Hospital.toLowerCase() < b.Hospital.toLowerCase() ? -1 : 1)));
    } catch (e) {
      console.warn(e);
    }
    console.log(`Hospitals in ${this._currentSelectedDivision} region are:`, this._hospitalData);
    console.log(`Hospitals in all regions are:`, this._allHospitalData);
  }
  showAllHospitals() {
    this._hospitalData = this._allHospitalData;
    this._hospitalFilterDivisionPillVisible = false;
  }
  selectHospital(hospital) {
    this._currentSelectedHospital = hospital;
    this._notification.setHospitalFilter(hospital);
    if (this._currentSelectedHospital.Division !== this._currentSelectedDivision) {
      console.log(`currentSelectedHospital`, this._currentSelectedHospital, 'global division selected', this._currentSelectedDivision);
      this.selectDivision(this._currentSelectedHospital.Division);
    }

  }
  closeFilterPanel() {
    this._notification.toggleFilterPanel(false);
    this._currentSelectedDivision = this._notification.getSelectedDivisionBuffer();
    this._hospitalFilterDivisionPillVisible = true;
    this.processHospitalNames(this._hospitalKPIData, this.hscDataDivisionGrouped[this._currentSelectedDivision]);
    this._openTabGroup = null;

  }

  toggleTabGroup(n) {
    console.log('this._currentWindowWidth', this._currWindowWidth);
    if (n) {
      this._openTabGroup = this._openTabGroup === parseInt(n, 0) ? null : parseInt(n, 0);
      // if (this._currWindowWidth < 992) {
      //   // this.viewResults();
      // } else {
      //   this._openTabGroup = this._openTabGroup === parseInt(n, 0) ? null : parseInt(n, 0);
      // }
    } else {
      this._openTabGroup = null;
    }
  }
  selectDivision(division: string) {
    if (division.trim() !== this._currentSelectedDivision.trim()) {
      this._currentSelectedDivision = division;
      // Directly apply filter (removed view results btn)
      this._notification.sendSelectedDivision(this._currentSelectedDivision);
      if(division.trim() !== this._currentSelectedHospital.Division.trim()) {
        this._notification.setHospitalFilter(null);
      }
      this._hospitalFilterDivisionPillVisible = true;
    }
    if (this._currWindowWidth < 992) {
      this.toggleTabGroup(1);
    }
    console.log('this._currentSelectedDivision', this._currentSelectedDivision);
  }

  // viewResults() {
  //   if (this._currentSelectedDivision.trim().toLowerCase() !== this._notification.getSelectedDivisionBuffer().trim().toLowerCase()) {
  //     this._notification.sendSelectedDivision(this._currentSelectedDivision.trim());
  //   }
  //   this.closeFilterPanel();
  // }

  get isFilterPanelToggled() {
    return this._isFilterPanelToggled;
  }
  get openTabGroup() {
    return this._openTabGroup;
  }
  get lommDivisions() {
    return this._lommDivisions;
  }
  get currentSelectedDivision() {
    return this._currentSelectedDivision;
  }
  get isHscPage() {
    return this._isHscPage;
  }
  get hospitalData() {
    return this._hospitalData || [];
  }

  get hospitalFilterDivisionPillVisible() {
    return this._hospitalFilterDivisionPillVisible;
  }

  get currentSelectedHospital() {
    return this._currentSelectedHospital;
  }



}
