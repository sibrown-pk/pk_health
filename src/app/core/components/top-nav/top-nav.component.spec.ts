import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TopNavComponent } from './top-nav.component';
import { DataService } from '../../services/data.service';
describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;
  let dataServiceStub;
  beforeEach(async(() => {
    dataServiceStub = {
      getMenuData: () => ({ then: () => ({ catch: () => ({}) }) })
    };
    TestBed.configureTestingModule({
      declarations: [TopNavComponent],
      providers: [{ provide: DataService, useValue: dataServiceStub },]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const elementRefStub = { nativeElement: { contains: () => ({}) } };
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('toggleNavbar', () => {
    it('it makes expected calls', () => {
      spyOnProperty(component, 'isNavbarOpen', 'get').and.callThrough();
      component.toggleNavbar();
      expect(component.isNavbarOpen).toBe(true);
    });
  });
  describe('toggleOverlayMenu', () => {
    it('it makes expected calls without param', () => {
      spyOn(component, 'isOverlayMenuVisible').and.callThrough();
      component.toggleOverlayMenu(1);
      expect(component.isOverlayMenuVisible(1)).toBe(true);
    });
    it('it makes expected calls with param', () => {
      spyOn(component, 'isOverlayMenuVisible').and.callThrough();
      component.toggleOverlayMenu(null);
      expect(component.isOverlayMenuVisible(1)).toBe(false);
    });
  });
  describe('onOutsideClick', () => {
    it('it makes expected calls without param', () => {
      spyOn(component, 'toggleOverlayMenu');
      component.onOutsideClick(null);
      expect(component.toggleOverlayMenu).not.toHaveBeenCalled();
    });
  });
  describe('getOverlayItemIconClass', () => {
    it('returns expected values with param', () => {
      spyOn(component, 'getOverlayItemIconClass').and.callThrough();
      expect(component.getOverlayItemIconClass('dashboard')).toEqual('fa-tachometer');
    });
    it('returns expected values with wrong param', () => {
      spyOn(component, 'getOverlayItemIconClass').and.callThrough();
      expect(component.getOverlayItemIconClass('')).toEqual('fa-tachometer');
    });
    it('returns expected values with wrong param', () => {
      spyOn(component, 'getOverlayItemIconClass').and.callThrough();
      expect(component.getOverlayItemIconClass('key')).toEqual('fa-pie-chart');
    });
    it('returns expected values with wrong param', () => {
      spyOn(component, 'getOverlayItemIconClass').and.callThrough();
      expect(component.getOverlayItemIconClass('explorers')).toEqual('fa-sliders');
    });
  });
  describe('getSentenceCase', () => {
    it('returns expected values', () => {
      spyOn(component, 'getSentenceCase').and.callThrough();
      expect(component.getSentenceCase('asdAdsad')).toEqual('Asd Adsad');
    });
  });
});
