import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardPrimaryComponent } from './card-primary.component';
describe('CardPrimaryComponent', () => {
  let component: CardPrimaryComponent;
  let fixture: ComponentFixture<CardPrimaryComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CardPrimaryComponent]
    });
    fixture = TestBed.createComponent(CardPrimaryComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
