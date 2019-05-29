import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { DataService } from '../../services/data.service';
import { BreakpointService } from 'src/app/core/services/breakpoint.service';
import { AppFilterComponent } from './app-filter.component';

describe('AppFilterComponent', () => {
  let component: AppFilterComponent;
  let fixture: ComponentFixture<AppFilterComponent>;
  let dataServiceStub;
  let notificationServiceStub;
  beforeEach(() => {
    notificationServiceStub = {
      filterPanelStatus: () => ({ subscribe: () => ({}) }),
      toggleFilterPanel: () => ({}),
      sendSelectedDivision: () => ({}),
      sendFilterParams: () => ({}),
      getSelectedDivision: () => ({ pipe: () => ({ subscribe: () => ({}) }) }),
      getSelectedDivisionBuffer: () => ({ trim: () => ({ toLowerCase: () => ({}) }), }),
      getSelectedFilterParams: () => ({ subscribe: () => ({}) })
    };
    dataServiceStub = {
      getLommData: () => ({ then: () => ({ catch: () => ({}) }) })
    };
    spyOn(dataServiceStub, 'getLommData').and.callThrough();
    const breakpointServiceStub = {
      getWindowSize: { width: {} },
      getCurrentWindowWidth: () => ({ subscribe: () => ({}) })
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppFilterComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceStub },
        { provide: DataService, useValue: dataServiceStub },
        { provide: BreakpointService, useValue: breakpointServiceStub }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppFilterComponent);
    component = fixture.componentInstance;

  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('constructor', () => {
    it('makes expected calls', () => {
      dataServiceStub.getLommData();
      expect(dataServiceStub.getLommData).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'sendFilterParams').and.returnValue({ subscribe: () => { } });
      spyOn(notificationServiceStub, 'filterPanelStatus').and.returnValue({ subscribe: () => { } });
      spyOn(notificationServiceStub, 'getSelectedDivision').and.callThrough();
      spyOn(notificationServiceStub, 'getSelectedFilterParams').and.callThrough();
      component.ngOnInit();
      expect(notificationServiceStub.sendFilterParams).toHaveBeenCalled();
      expect(notificationServiceStub.filterPanelStatus).toHaveBeenCalled();
      expect(notificationServiceStub.getSelectedDivision).toHaveBeenCalled();
      expect(notificationServiceStub.getSelectedFilterParams).toHaveBeenCalled();
    });
  });
  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      const breakpointServiceStub: BreakpointService = fixture.debugElement.injector.get(
        BreakpointService
      );
      spyOn(breakpointServiceStub, 'getCurrentWindowWidth').and.returnValue({ subscribe: () => { } });
      component.ngAfterViewInit();
      expect(breakpointServiceStub.getCurrentWindowWidth).toHaveBeenCalled();
    });
  });
  describe('closeFilterPanel', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'toggleFilterPanel');
      spyOn(notificationServiceStub, 'getSelectedDivisionBuffer').and.callThrough();
      component.closeFilterPanel();
      expect(notificationServiceStub.toggleFilterPanel).toHaveBeenCalled();
      expect(notificationServiceStub.getSelectedDivisionBuffer).toHaveBeenCalled();
    });
  });
  describe('viewResults', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(component, 'closeFilterPanel');
      spyOn(notificationServiceStub, 'sendFilterParams').and.returnValue({ subscribe: () => { } });
      spyOn(notificationServiceStub, 'sendSelectedDivision').and.callThrough();
      component.viewResults();
      expect(notificationServiceStub.sendFilterParams).toHaveBeenCalled();
      expect(component.closeFilterPanel).toHaveBeenCalled();
      expect(notificationServiceStub.sendSelectedDivision).toHaveBeenCalled();
    });
  });

  describe('toggleTabGroup', () => {
    beforeEach(() => {
      spyOn(component, 'viewResults');
    });
    it('makes expected calls when argument is passed', () => {
      component.toggleTabGroup(1);
      expect(component.viewResults).toHaveBeenCalled();
    });
    it('makes expected calls when no argument is passed', () => {
      spyOnProperty(component, 'openTabGroup', 'get').and.callThrough();
      component.toggleTabGroup(1200);
      expect(component.openTabGroup).toBe(null);
    });
  });

  describe('isFilterPanelToggled', () => {
    it('makes expected calls', () => {
      spyOnProperty(component, 'isFilterPanelToggled', 'get').and.callThrough();
      expect(component.isFilterPanelToggled).toEqual(false);
    });
  });

  describe('currentSelectedDivision', () => {
    it('returns expected values', () => {
      spyOnProperty(component, 'currentSelectedDivision', 'get').and.returnValue('CHI');
      expect(component.currentSelectedDivision).toEqual('CHI');
    });
  });

  describe('openTabGroup', () => {
    it('returns expected values', () => {
      spyOnProperty(component, 'openTabGroup', 'get').and.callThrough();
      expect(component.openTabGroup).toEqual(null);
    });
  });
  describe('lommDivisions', () => {
    it('returns expected values', () => {
      spyOnProperty(component, 'lommDivisions', 'get').and.callThrough();
      expect(component.lommDivisions).toEqual([]);
    });
  });
  describe('selectDivision', () => {
    it('makes expected calls when division is other than default', () => {
      spyOnProperty(component, 'selectedFilterParams', 'get').and.callThrough();
      component.selectDivision('Kentucky');
      expect(component.selectedFilterParams.length).toEqual(1);
      expect(component.selectedFilterParams[0]).toEqual('Kentucky');
    });
  });
  describe('getLommData', () => {
    it('makes expected calls', (done) => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      spyOnProperty(component, 'lommDivisions', 'get').and.callThrough();

      dataServiceStub.getLommData().then(res => {
        expect(res.length).toEqual(2);
        expect(component.lommDivisions.length).toEqual(10);
      });
      done();
    });
  });


});
