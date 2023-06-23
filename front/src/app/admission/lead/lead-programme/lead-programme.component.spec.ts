import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadProgrammeComponent } from './lead-programme.component';

describe('LeadProgrammeComponent', () => {
  let component: LeadProgrammeComponent;
  let fixture: ComponentFixture<LeadProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadProgrammeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
