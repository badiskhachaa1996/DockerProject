import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureFormateurComponent } from './facture-formateur.component';

describe('FactureFormateurComponent', () => {
  let component: FactureFormateurComponent;
  let fixture: ComponentFixture<FactureFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureFormateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
