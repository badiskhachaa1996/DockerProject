import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviTicketsComponent } from './suivi-tickets.component';

describe('SuiviTicketsComponent', () => {
  let component: SuiviTicketsComponent;
  let fixture: ComponentFixture<SuiviTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
