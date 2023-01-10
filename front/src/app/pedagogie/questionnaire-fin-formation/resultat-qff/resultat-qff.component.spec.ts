import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatQFFComponent } from './resultat-qff.component';

describe('ResultatQFFComponent', () => {
  let component: ResultatQFFComponent;
  let fixture: ComponentFixture<ResultatQFFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultatQFFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatQFFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
