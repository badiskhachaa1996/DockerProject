import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsFormulaireIcbsComponent } from './resultats-formulaire-icbs.component';

describe('ResultatsFormulaireIcbsComponent', () => {
  let component: ResultatsFormulaireIcbsComponent;
  let fixture: ComponentFixture<ResultatsFormulaireIcbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultatsFormulaireIcbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatsFormulaireIcbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
