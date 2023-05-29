import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutLeadcrmComponent } from './ajout-leadcrm.component';

describe('AjoutLeadcrmComponent', () => {
  let component: AjoutLeadcrmComponent;
  let fixture: ComponentFixture<AjoutLeadcrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutLeadcrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutLeadcrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
