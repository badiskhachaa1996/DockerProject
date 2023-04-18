import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationAdmissionComponent } from './formation-admission.component';

describe('FormationAdmissionComponent', () => {
  let component: FormationAdmissionComponent;
  let fixture: ComponentFixture<FormationAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationAdmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
