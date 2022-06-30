import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireAdmissionComponent } from './formulaire-admission.component';

describe('FormulaireAdmissionComponent', () => {
  let component: FormulaireAdmissionComponent;
  let fixture: ComponentFixture<FormulaireAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireAdmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
