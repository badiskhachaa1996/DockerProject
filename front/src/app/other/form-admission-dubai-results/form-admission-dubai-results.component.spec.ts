import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdmissionDubaiResultsComponent } from './form-admission-dubai-results.component';

describe('FormAdmissionDubaiResultsComponent', () => {
  let component: FormAdmissionDubaiResultsComponent;
  let fixture: ComponentFixture<FormAdmissionDubaiResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAdmissionDubaiResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdmissionDubaiResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
