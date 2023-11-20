import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadEvaluationComponent } from './lead-evaluation.component';

describe('LeadEvaluationComponent', () => {
  let component: LeadEvaluationComponent;
  let fixture: ComponentFixture<LeadEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
