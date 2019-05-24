import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IframeWrapperComponent } from './iframe-wrapper.component';
describe('IframeWrapperComponent', () => {
  let component: IframeWrapperComponent;
  let fixture: ComponentFixture<IframeWrapperComponent>;
  beforeEach(() => {
    const domSanitizerStub = { bypassSecurityTrustResourceUrl: () => ({}) };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IframeWrapperComponent],
      providers: [{ provide: DomSanitizer, useValue: domSanitizerStub }]
    });
    fixture = TestBed.createComponent(IframeWrapperComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const domSanitizerStub: DomSanitizer = fixture.debugElement.injector.get(
        DomSanitizer
      );
      spyOn(domSanitizerStub, 'bypassSecurityTrustResourceUrl');
      component.ngOnInit();
      expect(
        domSanitizerStub.bypassSecurityTrustResourceUrl
      ).toHaveBeenCalled();
    });
  });
});
