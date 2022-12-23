import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireIntunsComponent } from './formulaire-intuns.component';

describe('FormulaireIntunsComponent', () => {
  let component: FormulaireIntunsComponent;
  let fixture: ComponentFixture<FormulaireIntunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireIntunsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireIntunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
