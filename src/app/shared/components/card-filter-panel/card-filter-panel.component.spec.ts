import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardFilterPanelComponent } from './card-filter-panel.component';
describe('CardFilterPanelComponent', () => {
  let component: CardFilterPanelComponent;
  let fixture: ComponentFixture<CardFilterPanelComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CardFilterPanelComponent]
    });
    fixture = TestBed.createComponent(CardFilterPanelComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('divisions defaults to: []', () => {
    expect(component.divisions).toEqual([]);
  });
});
