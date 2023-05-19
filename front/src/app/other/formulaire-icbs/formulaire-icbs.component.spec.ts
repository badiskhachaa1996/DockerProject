import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireIcbsComponent } from './formulaire-icbs.component';

describe('FormulaireIcbsComponent', () => {
  let component: FormulaireIcbsComponent;
  let fixture: ComponentFixture<FormulaireIcbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireIcbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireIcbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
