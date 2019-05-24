import { TestBed } from '@angular/core/testing';
import { BreakpointService } from './services/breakpoint.service';
import { CoreModule } from './core.module';
describe('CoreModule', () => {
  let pipe: CoreModule;
  beforeEach(() => {
    const iBreakpointConfigStub = {};
    TestBed.configureTestingModule({
      providers: [
        CoreModule,
        { provide: BreakpointService, useValue: iBreakpointConfigStub }
      ]
    });
    pipe = TestBed.get(CoreModule);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
