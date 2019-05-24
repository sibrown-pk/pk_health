import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-card-filter-panel',
  templateUrl: './card-filter-panel.component.html',
  styleUrls: ['./card-filter-panel.component.scss']
})
export class CardFilterPanelComponent implements OnInit {

  private _dropVis = false;
  private _dropdownselectMeasure = 'CHI';
  @Output('card-division-selection') cardDivisionSelect: EventEmitter<string> = new EventEmitter(null);
  @Input('divisions') divisions: Array<string> = [];
  constructor() { }

  ngOnInit() {
  }

  dropdownToggle() {
    this._dropVis = !this._dropVis;
    // console.log('this.dropVis', this._dropVis);
  }
  emitCardDivision(s: string) {
    this.cardDivisionSelect.emit(s);
    this._dropdownselectMeasure = s;
  }

  get dropdownselectMeasure(): string {
    return this._dropdownselectMeasure;
  }
  get dropVis() {
    return this._dropVis;
  }

}
