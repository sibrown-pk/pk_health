import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavBreadcrumbsComponent } from './nav-breadcrumbs.component';
import { routes } from 'src/app/app.routing.module';
describe('NavBreadcrumbsComponent', () => {
  let component: NavBreadcrumbsComponent;
  let fixture: ComponentFixture<NavBreadcrumbsComponent>;
  let routerStub;
  let activatedRouteStub;
  beforeEach(() => {
    routerStub = {
      events: { pipe: () => ({ subscribe: () => ({}) }) },
      navigate: () => ({})
    };
    activatedRouteStub = {
      root: {},
      routeConfig: { data: {}, path: {} },
      firstChild: {}
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [NavBreadcrumbsComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    });

    fixture = TestBed.createComponent(NavBreadcrumbsComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      routerStub = fixture.debugElement.injector.get(
        Router
      );
      spyOn(routerStub.events, 'pipe').and.callThrough();
      spyOn(component, 'buildBreadCrumb').and.returnValue([]);
      component.ngOnInit();
      component.buildBreadCrumb(activatedRouteStub);
      expect(component.buildBreadCrumb).toHaveBeenCalled();
      expect(routerStub.events.pipe).toHaveBeenCalled();
    });
  });
  describe('buildBreadCrumb', () => {
    it('returns expected values', () => {
      spyOn(component, 'buildBreadCrumb').and.callThrough();
      const returnVal = component.buildBreadCrumb(activatedRouteStub);
      expect(returnVal.reverse()[0].label)
      .toBe(routes.find((item: Route) => item.path === routes.find(item => item.path === '').redirectTo).data['breadcrumb']);
    });
  });
});
