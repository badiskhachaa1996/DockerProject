import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireExterneSkillsnetComponent } from './formulaire-externe-skillsnet.component';

describe('FormulaireExterneSkillsnetComponent', () => {
  let component: FormulaireExterneSkillsnetComponent;
  let fixture: ComponentFixture<FormulaireExterneSkillsnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireExterneSkillsnetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireExterneSkillsnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
