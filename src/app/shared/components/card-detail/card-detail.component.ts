import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ILomm } from '../../interfaces/ILomm';
import { CardDataHelper } from './../../helpers/card_data_presentation';
import { DataManipulators } from '../../helpers/data_manipulators';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  public detailMode = false;
  private _performanceDashboardLinks = [];
  private _iframeUrl = '';
  @Input() public id = null;
  @Input('card-detail-data') public card: ILomm = null;
  @Input('card-detail-next-qtr-data') public cardNextQtr: ILomm = null;
  constructor(public _elRef: ElementRef) { }

  ngOnInit() {

  }

  toggleDetailMode(flag?: boolean) {
    this.detailMode = typeof flag !== 'undefined' ? flag : !this.detailMode;
  }

  metricUnit(format: string): string {
    return CardDataHelper.metricUnit(format);
  }
  public loadPerformanceDashboardLinks() {
    const valuesPolyfill = DataManipulators.valuesPolyfill;

    const values = Object.values || valuesPolyfill;
    this._performanceDashboardLinks = this.card && this.card.summary ? values(this.card.summary).slice(1).filter(item => item !== null && item !== undefined && item !== '') : [];
    console.log('performanceDashBoardLinks', this._performanceDashboardLinks);
  }

  get performanceDashboardLinks() {
    return this._performanceDashboardLinks;
  }

  get iframeUrl() {
    return this._iframeUrl = this.card && this.card.QlikUrl ? this.card.QlikUrl : '';
  }

}
