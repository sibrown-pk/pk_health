import { TestBed } from '@angular/core/testing';
import { HscRoutingModule } from './hsc.routing.module';
describe('HscRoutingModule', () => {
  let pipe: HscRoutingModule;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HscRoutingModule] });
    pipe = TestBed.get(HscRoutingModule);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
