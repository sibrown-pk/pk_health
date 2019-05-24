import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { DataService } from './data.service';
import { C_LOMM_DATA_URL, C_QUICK_LINKS } from 'src/app/shared/constants/paths';
describe('DataService', () => {
  let service: DataService;
  beforeEach(() => {
    const httpClientStub = { get: () => ({ toPromise: () => ({}) }) };
    const papaStub = {};
    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: HttpClient, useValue: httpClientStub },
        { provide: Papa, useValue: papaStub }
      ]
    });
    service = TestBed.get(DataService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getLommCardStyles', () => {
    it('makes expected calls', () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      spyOn(httpClientStub, 'get').and.returnValue({ toPromise: () => { } });
      service.getLommCardStyles();
      expect(httpClientStub.get).toHaveBeenCalled();
    });
  });
  describe('getQuickLinksData', () => {
    it('makes expected calls', () => {
      spyOn(service, 'CSVtoJson').and.callThrough();
      service.CSVtoJson(C_QUICK_LINKS).then(res => {
        expect(res.length > 0).toBe(true);
      });
    });
  });
  describe('getLommCardInfo', () => {
    it('returns expected values', () => {
      spyOn(service, 'getLommCardInfo').and.callThrough();
      const returnVal = service.getLommCardInfo();
      expect(Object.keys(returnVal[0]).length).toBe(9);
    });
  });
  describe('getLommCardSummary', () => {
    it('returns expected values', () => {
      spyOn(service, 'getLommCardSummary').and.callThrough();
      const returnVal = service.getLommCardSummary();
      expect(Object.keys(returnVal).length).toBe(9);
    });
  });
  describe('getLommData', () => {
    it('makes expected calls', (done) => {
      spyOn(service, 'CSVtoJson').and.callThrough();
      service.CSVtoJson(C_LOMM_DATA_URL).then(res => {
        expect(Object.keys(res).length).toBe(2);
      });
      done();
    });
  });
});
