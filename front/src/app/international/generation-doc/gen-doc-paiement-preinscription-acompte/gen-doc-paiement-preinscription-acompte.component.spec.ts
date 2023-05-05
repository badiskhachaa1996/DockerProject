import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDocPaiementPreinscriptionAcompteComponent } from './gen-doc-paiement-preinscription-acompte.component';

describe('GenDocPaiementPreinscriptionAcompteComponent', () => {
  let component: GenDocPaiementPreinscriptionAcompteComponent;
  let fixture: ComponentFixture<GenDocPaiementPreinscriptionAcompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenDocPaiementPreinscriptionAcompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenDocPaiementPreinscriptionAcompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
