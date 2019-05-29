import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { LandingPageComponent } from './landing-page.component';
describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  beforeEach(() => {
    const routerStub = { navigate: () => ({}) };
    const dataServiceStub = {
      getQuickLinksData: () => ({ then: () => ({ catch: () => ({}) }) })
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LandingPageComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: DataService, useValue: dataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
