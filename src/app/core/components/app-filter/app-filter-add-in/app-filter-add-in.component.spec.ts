import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppFilterAddInComponent } from './app-filter-add-in.component';
describe('AppFilterAddInComponent', () => {
  let component: AppFilterAddInComponent;
  let fixture: ComponentFixture<AppFilterAddInComponent>;
  beforeEach(() => {
    const notificationServiceStub = {
      getSelectedFilterParams: () => ({ subscribe: () => ({}) }),
      getSelectedFilterParamsBuffer: () => ({}),
      sendSelectedDivision: () => ({}),
      sendFilterParams: () => ({})
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppFilterAddInComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AppFilterAddInComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'getSelectedFilterParamsBuffer');
      component.ngOnInit();
      expect(
        notificationServiceStub.getSelectedFilterParamsBuffer
      ).toHaveBeenCalled();
    });

    describe('filterParams', () => {
      it('makes expected calls', () => {
        spyOnProperty(component, 'filterParams', 'get').and.callThrough();
        expect(component.filterParams).toEqual([]);
      });
    });
  });
  describe('removeFilterParam', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'sendSelectedDivision').and.callThrough();
      spyOn(notificationServiceStub, 'sendFilterParams').and.callThrough();
      component.removeFilterParam('CHI', 1);
      expect(
        notificationServiceStub.sendSelectedDivision
      ).not.toHaveBeenCalled();
      expect(
        notificationServiceStub.sendFilterParams
      ).not.toHaveBeenCalled();
    });
  });
});

