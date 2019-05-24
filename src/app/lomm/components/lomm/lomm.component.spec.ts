import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { BreakpointService } from '../../../core/services/breakpoint.service';
import { LommComponent } from './lomm.component';
import { MLomm } from 'src/app/shared/models/Lomm';
import { MBreakpointConfig } from 'src/app/shared/models/Breakpoint';
describe('LommComponent', () => {
  let component: LommComponent;
  let fixture: ComponentFixture<LommComponent>;
  let iLommStub;
  let breakpointEventStub;
  let dataServiceStub;
  let breakpointServiceStub;
  let lommCardStub;
  beforeEach(async(() => {
    lommCardStub = {
      Actual: { trim: () => ({ toLowerCase: () => 'tbd' }) },
      Goal: { trim: () => ({ toLowerCase: () => 'tbd' }) },
      danger: {},
      summary: {},
      MeasureName: { trim: () => ({ toLowerCase: () => null }) }
    }
    iLommStub = {
      Actual: { trim: () => ({ toLowerCase: () => ({}) }) },
      Goal: {},
      danger: {},
      summary: {},
      MeasureName: { trim: () => ({ toLowerCase: () => ({}) }) }
    };
    dataServiceStub = {
      getLommData: () => ({ then: () => ({ catch: () => ({}) }) }),
      getLommCardStyles: () => ({ then: () => ({ catch: () => ({}) }) }),
      getLommCardSummary: () => ({})
    };
    breakpointServiceStub = {
      breakpointChanges: { subscribe: () => ({}) }
    };
    breakpointEventStub = { breakpointName: {} };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LommComponent],
      providers: [
        { provide: MLomm, useValue: iLommStub },
        { provide: DataService, useValue: dataServiceStub },
        { provide: BreakpointService, useValue: breakpointServiceStub },
        { provide: MBreakpointConfig, useValue: breakpointEventStub }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LommComponent);
    component = fixture.componentInstance;
  }));


  describe('Asynchronous Specs', () => {
    let value;
    beforeEach((done) => {

      setTimeout(() => {
        value = 0;
        done();
      }, 1);
    });
    it('can load instance', (done) => {
      value++;
      expect(component).toBeTruthy();
      done();
    });
  });
  describe('getLommData', () => {
    it('makes expected calls', (done) => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      spyOn(dataServiceStub, 'getLommData').and.callThrough();
      spyOnProperty(component, 'lommDivisions', 'get').and.callThrough();
      spyOnProperty(component, 'lommData', 'get').and.callThrough();
      spyOnProperty(component, 'nextQtrdata', 'get').and.callThrough();

      dataServiceStub.getLommData().then(res => {
        expect(res.length).toEqual(2);
        expect(component.lommData.every(el => el.QuaterData === 'LOMM')).toBe(true);
        expect(component.nextQtrdata.every(el => el.QuaterData === 'LOMM2')).toBe(true);
        expect(component.lommDivisions.length).toEqual(10);
      });
      done();
    });
  });
  describe('addCardSummaryContent', () => {
    it('makes expected calls', () => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      spyOn(dataServiceStub, 'getLommCardSummary');
      const returnVal = component.addCardSummaryContent(iLommStub);
      expect(dataServiceStub.getLommCardSummary).toHaveBeenCalled();
      expect(returnVal.summary).toBe(null);
    });
  });
  describe('cardMatrixManager', () => {
    it('makes expected calls', () => {
      spyOn(LommComponent.prototype, 'cardMatrixManager').and.callThrough();
      spyOnProperty(component, 'cardMatrixDimension', 'get').and.callThrough();
      component.cardMatrixManager(breakpointEventStub);
      expect(LommComponent.prototype.cardMatrixManager).toHaveBeenCalled();
      expect(component.cardMatrixDimension).toEqual(3);
    });
  });
  describe('cardDivisionSelect', () => {
    let value;
    beforeEach((done) => {

      setTimeout(() => {
        value = 0;
        done();
      }, 1);
    });
    it('makes expected calls', (done) => {
      value++;
      spyOn(LommComponent.prototype, 'cardDivisionSelect').and.callThrough();
      spyOn(LommComponent.prototype, 'attachCardStyles').and.callThrough();
      spyOn(LommComponent.prototype, 'addCardSummaryContent').and.callThrough();
      spyOnProperty(component, 'currentDivisionFilterSelection', 'get').and.callThrough();
      spyOnProperty(component, 'cards', 'get').and.callThrough();

      component.cardDivisionSelect('Kentucky');
      expect(component.currentDivisionFilterSelection).toEqual('Kentucky');
      expect(component.cards.length).toEqual(0);
      expect(LommComponent.prototype.attachCardStyles).toHaveBeenCalled();
      expect(LommComponent.prototype.addCardSummaryContent).not.toHaveBeenCalled();

      done();
    });

  });
  describe('getColWidth', () => {
    it('makes expected calls', () => {
      spyOn(LommComponent.prototype, 'getColWidth').and.callThrough();
      component.getColWidth();
      expect(LommComponent.prototype.getColWidth).toHaveBeenCalled();
      expect(component.getColWidth()).toEqual(4);
    });
  });
  describe('cardClick', () => {
    it('makes expected calls', () => {
      spyOn(LommComponent.prototype, 'cardClick').and.callThrough();
      spyOn(LommComponent.prototype, 'cardDetailManager').and.callThrough();
      component.cardClick(iLommStub, 1);
      expect(LommComponent.prototype.cardClick).toHaveBeenCalled();
      expect(LommComponent.prototype.cardDetailManager).toHaveBeenCalled();
    });
  });
  describe('cardDetailManager', () => {
    it('makes expected calls', () => {
      spyOn(LommComponent.prototype, 'cardDetailManager').and.callThrough();
      component.cardDetailManager(iLommStub, 1);
      expect(LommComponent.prototype.cardDetailManager).toHaveBeenCalled();
    });
  });
  describe('getNextQtrCard', () => {
    it('it returns expected values', () => {
      spyOn(component, 'getNextQtrCard').and.callThrough();
      expect(component.getNextQtrCard(iLommStub)).toEqual(null);
    });
  });
  describe('cardDanger', () => {
    it('it returns expected values', () => {
      spyOn(component, 'cardDanger').and.callThrough();
      const returnVal = component.cardDanger(iLommStub);
      expect(returnVal.danger).toBe(false);
    });
  });
  describe('getQlikUrl', () => {
    it('it returns expected values', () => {
      spyOn(component, 'getQlikUrl').and.callThrough();
      const returnVal = component.getQlikUrl();
      expect(returnVal.includes('&select=Division')).toBe(true);
    });
  });
  describe('qlikUrl', () => {
    it('it returns expected values', () => {
      spyOnProperty(component, 'qlikUrl', 'get').and.callThrough();
      const returnVal = component.qlikUrl;
      expect(returnVal.includes('&select=Division')).toBe(true);
    });
  });
});
