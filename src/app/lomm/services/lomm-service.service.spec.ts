import { TestBed } from '@angular/core/testing';
import { LommService } from './lomm-service.service';
describe('LommService', () => {
  let service: LommService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LommService] });
    service = TestBed.get(LommService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
