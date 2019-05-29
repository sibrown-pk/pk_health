import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, OnDestroy } from '@angular/core';
import { ILomm } from '../../../shared/interfaces/ILomm';
import { DataManipulators } from '../../../shared/helpers/data_manipulators';
import { CardDetailComponent } from '../../../shared/components/card-detail/card-detail.component';
import * as VisualEffects from '../../../shared/helpers/visual_effects';
import { IQlikAppURLConfig, IQlikAppSelection } from '../../../shared/interfaces/IQlik';
import { MLommQlikAppURLConfig } from '../../../shared/models/Qlik';
import { QlikAPI } from '../../../shared/helpers/qlik_api';
import { CardDataHelper } from '../../../shared/helpers/card_data_presentation';
import { DataService } from '../../../core/services/data.service';
import { BreakpointService } from '../../../core/services/breakpoint.service';
import { Subscription } from 'rxjs';
import { BreakpointEvent } from 'src/app/shared/interfaces/IBreakpoint';
import { NotificationService } from 'src/app/core/services/notification.service';
import { C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT, C_QLIK_APP_FILTER_DIMENSION_DEFAULT, C_QLIK_LOMM_SEC_FILTER_DIMENSION_DEFAULT, C_QLIK_LOMM_SEC_FILTER_DIMENSION_VALUE_DEFAULT } from 'src/app/shared/constants/qlik_server_parameters';
import { encodeUriQuery } from '@angular/router/src/url_tree';

@Component({
  selector: 'app-lomm',
  templateUrl: './lomm.component.html',
  styleUrls: ['./lomm.component.scss']
})
export class LommComponent implements OnInit, AfterViewInit, OnDestroy {

  private _lommData: Array<ILomm>;
  private _lommDataDivisionGrouped = {};
  private _lommDivisions: Array<string> = [];
  private _cards: Array<ILomm> = [];
  private _cardsMatrix: Array<Array<ILomm>> = [];
  private _currentDivisionFilterSelection = this._notification.getSelectedDivisionBuffer() || C_QLIK_APP_FILTER_DIMENSION_VALUE_DEFAULT;
  private _nextQtrdata = [];
  private _nextQtrDataDivisionGrouped = {};
  private _nextQtrCards: Array<ILomm> = [];
  private QlikURLOptions: IQlikAppURLConfig = new MLommQlikAppURLConfig();
  private _cardMatrixDimension = 3;
  private subscriptions = new Subscription();

  @ViewChildren(CardDetailComponent) cardDetailGroup: QueryList<CardDetailComponent>;

  constructor(private _dataService: DataService, private _notification: NotificationService, private _breakpoint: BreakpointService) {

    this.subscriptions.add(
      this._breakpoint.breakpointChanges.subscribe({
        next: (res: BreakpointEvent) => {
          this.cardMatrixManager(res);
          this._cardsMatrix = DataManipulators.toMatrix(this._cards, this._cardMatrixDimension);
        },
        error: e => { console.warn(e); }
      })
    );
    // This is the subscriptions which triggers once the view results button is clicked. 
    // This subscription returns the filter selection
    this.subscriptions.add(
      this._notification.getSelectedDivision().subscribe({
        next: (division: string) => {
          this.cardDivisionSelect(division);
        },
        error: (e) => {
          console.warn(e);
        }
      })
    );
    this._dataService.getLommData().then(res => {
      res = DataManipulators.groupBy(res, 'QuaterData');
      const quarterKeys = res ? Object.keys(res) : [];
      if (quarterKeys.length > 0) {
        this._lommData = res[quarterKeys[0]] ? res[quarterKeys[0]].map((item: ILomm) => { item.Division = item.Division.trim(); return item; }) : [];
        this._nextQtrdata = res[quarterKeys[1]] ? res[quarterKeys[1]].map((item: ILomm) => { item.Division = item.Division.trim(); return item; }) : [];
        console.log(`${quarterKeys[0]}`, this._lommData);
        console.log(`${quarterKeys[1]}`, this._nextQtrdata);
      }

      try {
        this._lommDivisions = res[quarterKeys[0]] ? Array.from(new Set(this._lommData.map((key) => key.Division.trim()))) : [];
        this._lommDataDivisionGrouped = this._lommData.length > 0 ? DataManipulators.groupBy(this._lommData, 'Division') : null;
        this._nextQtrDataDivisionGrouped = res[quarterKeys[1]] ? DataManipulators.groupBy(this._nextQtrdata, 'Division') : [];
        this.cardDivisionSelect(this._currentDivisionFilterSelection);
      } catch (e) {
        console.warn(e);
      }
    }).catch(e => {
      console.warn(e);
    });

  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.cardDetailGroup.toArray().forEach(item => item.detailMode = false);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  cardDivisionSelect(key: string) {
    key = key.trim();
    this._currentDivisionFilterSelection = key;
    // The below line returns t he generated Qlik URL 
    // (with the selection parameter received from the filter component)
    // which is then passed on to the dumb component of the  iframe to load the Qlik app
    if (this._lommDivisions.indexOf(key) > -1) {
      // this._qlikUrl = this.getQlikUrl(
      //   [
      //     {
      //       dimension: C_QLIK_APP_FILTER_DIMENSION_DEFAULT,
      //       values: [key]
      //     },
      //     {
      //       dimension: C_QLIK_LOMM_SEC_FILTER_DIMENSION_DEFAULT,
      //       values: [C_QLIK_LOMM_SEC_FILTER_DIMENSION_VALUE_DEFAULT]
      //     }
      //   ]);
      // console.log('Default qlik url', this._qlikUrl);

      this._nextQtrCards = this._nextQtrDataDivisionGrouped[key];
      this._cards = this._lommDataDivisionGrouped[key] ? this._lommDataDivisionGrouped[key]
        .map((item: ILomm) => CardDataHelper.transformationCardDataFormat(item)) // Apply Transformation Card exception
        .map((item: ILomm) => this.addCardSummaryContent(item)) // Add the static data for Summary content from data service
        .map((item: ILomm) => this.addQlikUrlToLommCard(item)) // Add the qlik url for each card
        .map((item: ILomm) => this.cardDanger(item)) // Add the danger card logic for each card
        : [];
      this.attachCardStyles(this._cards).then((res) => {
        this._cards = res;
        this._cardsMatrix = DataManipulators.toMatrix(this._cards, this._cardMatrixDimension);
        console.log('this._cardsMatrix', this._cardsMatrix);
      }).catch(e => { console.warn(e); });
    } else {
      console.warn(`No data available for ${key} Division`);
      this._cards = [];
      this._cardsMatrix = null;
    }

  }

  cardClick(cardItem: ILomm, cardDetailIndex) {
    this.cardDetailManager(cardItem, cardDetailIndex);
  }


  cardDetailManager(cardItem: ILomm, cardDetailIndex: number) {
    if (this.cardDetailGroup) {
      this.cardDetailGroup.toArray().forEach((item: CardDetailComponent, index: number) => {
        if (index !== cardDetailIndex) {
          item.detailMode = false;
        } else {
          item.card = cardItem;
          item.cardNextQtr = this.getNextQtrCard(cardItem);
          item.detailMode = true;
          item.loadPerformanceDashboardLinks();
          VisualEffects.scrollToEl(item._elRef.nativeElement);
        }
      });
    }
  }

  cardDanger(card: ILomm): ILomm {
    // tslint:disable:radix
    const actualFigure: number =
      card.Actual !== null
        && card.Actual !== undefined
        && card.Actual !== ''
        && card.Actual.trim().toLowerCase() !== 'tbd' ? parseFloat(card.Actual) : 0;

    const goalFigure: number =
      card.Goal !== null
        && card.Goal !== undefined
        && card.Goal !== '' ? parseFloat(card.Goal) : 0;

    card.danger = actualFigure - goalFigure < 0 ? true : false;
    return card;
  }

  attachCardStyles(cards): Promise<Array<ILomm>> {
    return new Promise((resolve, reject) => {
      this._dataService.getLommCardStyles().then((res: Array<ILomm>) => {
        resolve(cards.map(x => Object.assign(x, res.find(y => y.MeasureName.toLowerCase().trim() === x.MeasureName.toLowerCase().trim()))));
      }).catch(e => { reject(e); });
    });
  }

  addCardSummaryContent(cardItem: ILomm): ILomm {
    const summary = this._dataService.getLommCardSummary();
    cardItem.summary = summary ? summary[cardItem.MeasureName.trim()] : null;
    return cardItem;
  }

  addQlikUrlToLommCard(cardItem: ILomm) {
    const qlikUrl = this.getQlikUrl(
      [
        {
          dimension: C_QLIK_APP_FILTER_DIMENSION_DEFAULT,
          values: [encodeURI(this._currentDivisionFilterSelection)]
        },
        {
          dimension: C_QLIK_LOMM_SEC_FILTER_DIMENSION_DEFAULT,
          values: [encodeURI(cardItem.MeasureName)]
        }
      ]);
    cardItem.QlikUrl = qlikUrl;
    console.log('Default qlik url', qlikUrl);
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

  getNextQtrCard(card: ILomm) {
    return this._nextQtrCards ? this._nextQtrCards.find(item => item.MeasureName.trim().toLowerCase() === card.MeasureName.trim().toLowerCase()) : null;
  }

  cardMatrixManager(breakpoint: BreakpointEvent) {
    switch (breakpoint.breakpointName) {
      case 'xs':
        this._cardMatrixDimension = 1;
        break;
      case 'sm':
        this._cardMatrixDimension = 2;
        break;
      case 'md':
        this._cardMatrixDimension = 2;
        break;
      case 'lg':
        this._cardMatrixDimension = 3;
        break;
      case 'xl':
        this._cardMatrixDimension = 3;
        break;
      default:
        this._cardMatrixDimension = 3;
        break;
    }
    console.log(this._cardMatrixDimension);
    console.log(breakpoint);


  }
  getColWidth() {
    return 12 / this._cardMatrixDimension;
  }

  get cards(): Array<ILomm> {
    return this._cards;
  }
  get nextQtrCards(): Array<ILomm> {
    return this._nextQtrCards;
  }
  get lommDivisions(): Array<string> {
    return this._lommDivisions;
  }
  get cardsMatrix(): Array<Array<ILomm>> {
    return this._cardsMatrix;
  }
  get currentDivisionFilterSelection(): string {
    return this._currentDivisionFilterSelection;
  }

  get lommData(): Array<ILomm> {
    return this._lommData;
  }
  get nextQtrdata(): Array<ILomm> {
    return this._nextQtrdata;
  }

  get cardMatrixDimension() {
    return this._cardMatrixDimension;
  }

}
