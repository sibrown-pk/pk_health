import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Subscription } from 'rxjs';
import { DataManipulators } from 'src/app/shared/helpers/data_manipulators';
import { MHscMonthWiseData } from 'src/app/shared/models/HSC';
import { distinctUntilChanged } from 'rxjs/operators';
import { C_ALL_HOSPITAL_KEY } from 'src/app/shared/constants/hsc';
import { C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT, C_QLIK_APP_FILTER_DIMENSION_DEFAULT, C_QLIK_HSC_SEC_FILTER_DIMENSION_DEFAULT, C_QLIK_HSC_PRI_FILTER_DIMENSION_DEFAULT } from 'src/app/shared/constants/qlik_server_parameters';
import { IQlikAppSelection, IQlikAppURLConfig } from 'src/app/shared/interfaces/IQlik';
import { QlikAPI } from 'src/app/shared/helpers/qlik_api';
import { MHscQlikAppURLConfig } from 'src/app/shared/models/Qlik';
import { IHospitalData } from 'src/app/shared/interfaces/IHsc';

@Component({
  selector: 'app-hsc',
  templateUrl: './hsc.component.html',
  styleUrls: ['./hsc.component.scss']
})
export class HscComponent implements OnInit, OnDestroy {

  private _hscKPIData;
  private _hscDivisions = [];
  private _hscKPIDataDivisionGrouped = null;
  private _currentDivisionHscData = null;
  private _currentDivisionSelection = C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT;
  private _currentSelectedMonthData = null;
  private _availableMonthData;
  private _currentSelectedHospital: IHospitalData = null;
  private QlikURLOptions: IQlikAppURLConfig = new MHscQlikAppURLConfig();
  private subcriptions = new Subscription();
  constructor(private _data: DataService, private _notification: NotificationService) {

    this._data.getHosiptalKPIData().then((res: any[]) => {
      this._currentDivisionSelection = this._notification.getSelectedDivisionBuffer();
      try {
        this._hscKPIDataDivisionGrouped = DataManipulators.groupBy(res, C_QLIK_APP_FILTER_DIMENSION_DEFAULT);
        this._hscDivisions = Object.keys(this._hscKPIDataDivisionGrouped);
        Object.keys(this._hscKPIDataDivisionGrouped).forEach(key => {
          this._hscKPIDataDivisionGrouped[key] = DataManipulators.groupBy(this._hscKPIDataDivisionGrouped[key], 'MeasureGroup');
        });
        this._currentDivisionHscData = JSON.parse(JSON.stringify(this._hscKPIDataDivisionGrouped[this._currentDivisionSelection]));
        this.collectAvailableMonthData(this._currentDivisionHscData);
        this.filterManager();
      } catch (e) {
        console.warn(e);
      }
    }).catch(e => {
      console.warn(e);
    });

  }

  ngOnInit() {
    this._currentDivisionSelection = this._notification.getSelectedDivisionBuffer();

    // Division Change Subscription
    this.subcriptions.add(
      this._notification.getSelectedDivision().pipe(distinctUntilChanged()).subscribe({
        next: (division: string) => {
          this._currentDivisionSelection = division;
          // If the HSC data grouped by Division is available then proceed
          if (this._hscKPIDataDivisionGrouped) {
            try {
              // Then get the HSC data for the current selected Division
              // Proceed if the current division data is available in hsc main sheet Else return as null
              this._currentDivisionHscData = this._hscDivisions.indexOf(this._currentDivisionSelection) > -1 ? JSON.parse(JSON.stringify(this._hscKPIDataDivisionGrouped[this._currentDivisionSelection])) : null;
              // If the HSC data grouped by CURRENT DIVISION is available only then proceed
              if (this._currentDivisionHscData !== null && this._currentDivisionHscData !== undefined) {
                // If current selected hospital's division is same as the current global division
                if (this._currentSelectedHospital.Division.trim().toLowerCase() === this._currentDivisionSelection.trim().toLowerCase()) {
                  this.collectAvailableMonthData(this._currentDivisionHscData);
                  this.filterManager();
                }
              } else {
                this._hscKPIData = null;
                this._currentSelectedHospital = null;
                console.warn(`Division ${this._currentDivisionSelection} data doesnt exist for HSC`);
              }
            } catch (e) {
              console.warn(e);
            }
          }
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );



    // Hospital filter selection subscription
    this.subcriptions.add(
      this._notification.getHospitalFilter().subscribe({
        next: (res: IHospitalData) => {
          // If any hospital particular hospital is selected
          this._currentSelectedHospital = res;
          // Proceed only if the selected hospital Division matches the global selected division
          if (this._currentSelectedHospital.Division === this._currentDivisionSelection && this._currentDivisionHscData) {
            this.collectAvailableMonthData(this._currentDivisionHscData);
            this.filterManager();
          }
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subcriptions.unsubscribe();
  }

  collectAvailableMonthData(currentDivisionHscData: any[]) {
    const quarterData = [];
    // const hospitalKey = isHospitalFilterApplicable === true ? this._currentSelectedHospital.Hospital : C_ALL_HOSPITAL_KEY;
    console.log('collectQuarter called', currentDivisionHscData, 'this._currentSelectedHospital.Hospital', this._currentSelectedHospital.Hospital);

    try {
      for (const key in currentDivisionHscData) {
        let currObj = null;
        currentDivisionHscData[key].forEach(item => {
          item.Hospital = item.Hospital === C_ALL_HOSPITAL_KEY ? `${item.Division} - All Hospitals` : item.Hospital;
          if (item.Hospital === this._currentSelectedHospital.Hospital && quarterData.every(i => i.FiscalYear !== item.FiscalYear || i.Month !== item.Month)) {
            quarterData.push(JSON.parse(JSON.stringify(new MHscMonthWiseData(item))));
            currObj = item.FiscalYear;
          }
        });
      }
      console.log('unsorted quarter dropdown Data', quarterData);
    } catch (e) {
      console.warn(e);
    }

    this._availableMonthData = quarterData.sort((a, b) => {
      if (b.FiscalYear !== a.FiscalYear) {
        return a.FiscalYear < b.FiscalYear ? 1 : -1;
      }
      return a.MonthNumber < b.MonthNumber ? 1 : -1;
    });
    console.log('quarterData', this._availableMonthData);
  }

  processDataMonthWise(selectedMonthData: { FiscalYear: string | number; Month: string | number, MonthNumber: string | number }, currentDivisionHscData) {
    const data = JSON.parse(JSON.stringify(currentDivisionHscData));
    try {
      // if a month has been selected in month-filter. then filter the data based on that month
      if (selectedMonthData) {
        Object.keys(data).forEach(key => {
          data[key]
            = data[key]
              .filter(item => item.FiscalYear === selectedMonthData.FiscalYear && item.Month === selectedMonthData.Month)
              .sort((a, b) => {
                if (b.FiscalYear !== a.FiscalYear) {
                  return a.FiscalYear < b.FiscalYear ? 1 : -1;
                }
                return a.MonthNumber < b.MonthNumber ? 1 : -1;
              });
        });
      } else {
        // if NO month has been selected in month-filter. then first sort the data for most recent, then return the latest one.
        Object.keys(data).forEach(key => {
          data[key] = data[key].sort((a, b) => {
            if (b.FiscalYear !== a.FiscalYear) {
              return a.FiscalYear < b.FiscalYear ? 1 : -1;
            }

            return a.MonthNumber < b.MonthNumber ? 1 : -1;
          }).filter(item => item.FiscalYear === data[key][0].FiscalYear && item.MonthNumber === data[key][0].MonthNumber);
        });
      }
      return JSON.parse(JSON.stringify(data)) || null;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  selectMonth(event: any) {
    const index = event.target.value;
    this._currentSelectedMonthData = index ? this._availableMonthData[index] : null;
    this.filterManager(true);
  }

  applyHospitalFilter(data, hospitalFilter) {
    const hospitalFilteredData = JSON.parse(JSON.stringify(data));
    console.log('HOSPITAL FILTER :', hospitalFilter);
    console.log('DATA BEFORE HOSPITAL FILTER:', data);

    for (const key in hospitalFilteredData) {
      hospitalFilteredData[key] =
        hospitalFilteredData[key]
          .filter(i => i.Hospital === hospitalFilter.Hospital);
    }
    console.log('DATA AFTER HOSPITAL FILTER:', hospitalFilteredData);
    return JSON.parse(JSON.stringify(hospitalFilteredData));
  }

  filterManager(monthFilterFirst?: boolean) {
    let data = null;
    try {
      if (monthFilterFirst) {
        const quarterProcessedData = this.processDataMonthWise(this._currentSelectedMonthData, this._currentDivisionHscData);
        data = this.applyHospitalFilter(quarterProcessedData, this._currentSelectedHospital);
      } else {
        const hospitalFilteredCurrentDivisionData = this.applyHospitalFilter(this._currentDivisionHscData, this._currentSelectedHospital);
        data = this.processDataMonthWise(this._currentSelectedMonthData, hospitalFilteredCurrentDivisionData);
      }
      if (data) {
        for (const key in data) {
          data[key] = data[key].map(item => this.addQlikUrlToHscCard(item));
        }
      }

    } catch (e) {
      console.warn(e);
    }

    console.log('hscKpiData', data);
    this._hscKPIData = this.sortHscKpiDataKeys(data);
    console.log('hscKpiData SORTED keys', this._hscKPIData);

  }

  sortHscKpiDataKeys(data: any) {
    const hscKpiData = JSON.parse(JSON.stringify(data));
    const sortedHscKpiData = {};
    const sortedKeys = Object.keys(hscKpiData).sort((a, b) => {
      if (hscKpiData[a][0].MeasureGroupOrder < hscKpiData[b][0].MeasureGroupOrder) {
        return -1;
      } else if (hscKpiData[a][0].MeasureGroupOrder > hscKpiData[b][0].MeasureGroupOrder) {
        return 1;
      } else {
        return 0;
      }
    });

    sortedKeys.forEach(key => {
      Object.defineProperty(sortedHscKpiData, key, {
        value: JSON.parse(JSON.stringify(hscKpiData[key])),
        enumerable: true
      });
      delete hscKpiData[key];
    });

    // return JSON.parse(JSON.stringify(sortedHscKpiData));
    return Object.entries(sortedHscKpiData);
  }

  addQlikUrlToHscCard(cardItem: any) {
    const qlikUrl = this.getQlikUrl(
      [
        {
          dimension: C_QLIK_APP_FILTER_DIMENSION_DEFAULT,
          values: [encodeURI(cardItem.Division)]
        },
        {
          dimension: 'Hospital',
          values: [encodeURI(this._currentSelectedHospital.isDefault ? C_ALL_HOSPITAL_KEY : cardItem.Hospital)]
        },
        {
          dimension: C_QLIK_HSC_PRI_FILTER_DIMENSION_DEFAULT,
          values: [encodeURI(cardItem.MeasureGroup)]
        },
        {
          dimension: C_QLIK_HSC_SEC_FILTER_DIMENSION_DEFAULT,
          values: [encodeURI(cardItem.Measure)]
        }
      ]);
    cardItem.QlikUrl = qlikUrl;
    return cardItem;
  }

  getQlikUrl(selections?: Array<IQlikAppSelection>): string {
    if (!selections) {
      return QlikAPI.generateQlikAppURL(this.QlikURLOptions);
    } else {
      this.QlikURLOptions.appSelections = selections;
      return QlikAPI.generateQlikAppURL(this.QlikURLOptions);
    }
  }

  get hscKPIData() {
    return this._hscKPIData;
  }

  get availableMonthData() {
    return this._availableMonthData;
  }

  get currentSelectedDivision() {
    return this._currentDivisionSelection;
  }

}
