import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireAdmissionInternationalComponent } from './formulaire-admission-international.component';

describe('FormulaireAdmissionInternationalComponent', () => {
  let component: FormulaireAdmissionInternationalComponent;
  let fixture: ComponentFixture<FormulaireAdmissionInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireAdmissionInternationalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireAdmissionInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
