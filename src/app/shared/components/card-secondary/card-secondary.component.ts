import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataManipulators } from '../../helpers/data_manipulators';

@Component({
  selector: 'app-card-secondary',
  templateUrl: './card-secondary.component.html',
  styleUrls: ['./card-secondary.component.scss']
})
export class CardSecondaryComponent implements OnInit, OnChanges {
  @Input('data') private _kpiCard = null;
  private _isAvailable: boolean = null;

  constructor() { }

  ngOnInit() {
    this._isAvailable = this._kpiCard !== null;
  }
  ngOnChanges() {
    this._isAvailable = this._kpiCard !== null;
  }

  isKPIDanger(card: any): boolean {
    return card ? parseFloat(card.Actual) - parseFloat(card.Goal) < 0 : false;
  }
  getMeasureFormat(value: number | string, format: string) {
    let formattedValue = '';
    format = format.toLowerCase();
    if (
      value !== null
      && value !== undefined
      && value.toString().trim().toLowerCase() !== 'tbd'
      && value.toString().trim().toLowerCase() !== '0'
      && value.toString().trim().toLowerCase() !== 'null'
      && value.toString().trim().toLowerCase() !== 'na'
    ) {
      switch (format) {
        case 'dollar':
          formattedValue = `$${DataManipulators.numberWithCommas(value)}`;
          break;
        case 'percent':
          formattedValue = `${value}%`;
          break;
        case 'number':
          formattedValue = `${DataManipulators.numberWithCommas(value)}`;
          break;
        default:
          formattedValue = `${value}`;
          break;
      }
    } else {
      formattedValue = `${value}`;
    }

    return formattedValue;
  }
  get kpiCard() {
    return this._kpiCard || null;
  }

  get qlikUrl() {
    return this._kpiCard && this._kpiCard.QlikUrl ? this._kpiCard.QlikUrl : '';
  }

  get isAvailable() {
    return this._isAvailable;
  }

}
