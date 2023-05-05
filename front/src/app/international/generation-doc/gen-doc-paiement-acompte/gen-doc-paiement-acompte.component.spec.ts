import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDocPaiementAcompteComponent } from './gen-doc-paiement-acompte.component';

describe('GenDocPaiementAcompteComponent', () => {
  let component: GenDocPaiementAcompteComponent;
  let fixture: ComponentFixture<GenDocPaiementAcompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenDocPaiementAcompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenDocPaiementAcompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
