import { HscModule } from './hsc.module';

describe('HscModule', () => {
  let hscModule: HscModule;

  beforeEach(() => {
    hscModule = new HscModule();
  });

  it('should create an instance', () => {
    expect(hscModule).toBeTruthy();
  });
});
