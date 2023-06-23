import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadInformationsPersonnelComponent } from './lead-informations-personnel.component';

describe('LeadInformationsPersonnelComponent', () => {
  let component: LeadInformationsPersonnelComponent;
  let fixture: ComponentFixture<LeadInformationsPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadInformationsPersonnelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadInformationsPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
