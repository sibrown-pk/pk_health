import { LommModule } from './lomm.module';

describe('LommModule', () => {
  let lommModule: LommModule;

  beforeEach(() => {
    lommModule = new LommModule();
  });

  it('should create an instance', () => {
    expect(lommModule).toBeTruthy();
  });
});
