import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDocPaiementPreinscriptionComponent } from './gen-doc-paiement-preinscription.component';

describe('GenDocPaiementPreinscriptionComponent', () => {
  let component: GenDocPaiementPreinscriptionComponent;
  let fixture: ComponentFixture<GenDocPaiementPreinscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenDocPaiementPreinscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenDocPaiementPreinscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
