import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierRemboursementComponent } from './dossier-remboursement.component';

describe('DossierRemboursementComponent', () => {
  let component: DossierRemboursementComponent;
  let fixture: ComponentFixture<DossierRemboursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DossierRemboursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierRemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
