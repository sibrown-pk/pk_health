import { Component, OnInit, Input } from '@angular/core';
import { CardDataHelper } from './../../helpers/card_data_presentation';
import { ILomm } from '../../interfaces/ILomm';

@Component({
  selector: 'app-card-primary',
  templateUrl: './card-primary.component.html',
  styleUrls: ['./card-primary.component.scss']
})
export class CardPrimaryComponent implements OnInit {

  @Input('card-data') card: ILomm = null;
  @Input('card-next-qtr-data') cardNextQtr: ILomm = null;
  constructor() { }

  ngOnInit() { }

  metricUnit(format: string): string {
    return CardDataHelper.metricUnit(format);
  }
  getStyle(ColorName) {
    return {
      border: '1px solid ' + ColorName
    };
  }
}
