import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCandidatureComponent } from './lead-candidature.component';

describe('LeadCandidatureComponent', () => {
  let component: LeadCandidatureComponent;
  let fixture: ComponentFixture<LeadCandidatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadCandidatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadCandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
