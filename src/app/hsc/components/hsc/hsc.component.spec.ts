import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { HscComponent } from './hsc.component';
describe('HscComponent', () => {
  let component: HscComponent;
  let fixture: ComponentFixture<HscComponent>;
  beforeEach(() => {
    const dataServiceStub = {
      getHosiptalKPIData: () => ({ then: () => ({ catch: () => ({}) }) })
    };
    const notificationServiceStub = {
      getSelectedDivisionBuffer: () => ({}),
      getSelectedDivision: () => ({ subscribe: () => ({}) })
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HscComponent],
      providers: [
        { provide: DataService, useValue: dataServiceStub },
        { provide: NotificationService, useValue: notificationServiceStub }
      ]
    });
    fixture = TestBed.createComponent(HscComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(dataServiceStub, 'getHosiptalKPIData').and.callThrough();
      spyOn(notificationServiceStub, 'getSelectedDivisionBuffer');
      spyOn(notificationServiceStub, 'getSelectedDivision').and.callThrough();
      component.ngOnInit();
      expect(dataServiceStub.getHosiptalKPIData).toHaveBeenCalled();
      expect(
        notificationServiceStub.getSelectedDivisionBuffer
      ).toHaveBeenCalled();
      expect(notificationServiceStub.getSelectedDivision).toHaveBeenCalled();
    });
  });
});
