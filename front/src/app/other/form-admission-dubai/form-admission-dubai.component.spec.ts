import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdmissionDubaiComponent } from './form-admission-dubai.component';

describe('FormAdmissionDubaiComponent', () => {
  let component: FormAdmissionDubaiComponent;
  let fixture: ComponentFixture<FormAdmissionDubaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAdmissionDubaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdmissionDubaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
