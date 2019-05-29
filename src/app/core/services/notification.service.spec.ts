import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
describe('NotificationService', () => {
  let service: NotificationService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NotificationService] });
    service = TestBed.get(NotificationService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getCurrentStatusOfFilterPanel', () => {
    it('it returns expected values', () => {
      spyOn(service, 'getCurrentStatusOfFilterPanel').and.callThrough();
      expect(service.getCurrentStatusOfFilterPanel()).toEqual(false);
    });
  });
  describe('getSelectedDivisionBuffer', () => {
    it('it returns expected values', () => {
      spyOn(service, 'getSelectedDivisionBuffer').and.callThrough();
      expect(service.getSelectedDivisionBuffer()).toEqual('CHI');
    });
  });
  describe('sendSelectedDivision', () => {
    it('it returns expected values', () => {
      spyOn(service, 'sendSelectedDivision').and.callThrough();
      expect(service.sendSelectedDivision('CHI')).toBeUndefined();
    });
  });
});
