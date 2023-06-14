import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSuiviComponent } from './lead-suivi.component';

describe('LeadSuiviComponent', () => {
  let component: LeadSuiviComponent;
  let fixture: ComponentFixture<LeadSuiviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadSuiviComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSuiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
