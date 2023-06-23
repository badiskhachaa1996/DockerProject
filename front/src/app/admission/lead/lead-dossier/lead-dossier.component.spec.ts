import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDossierComponent } from './lead-dossier.component';

describe('LeadDossierComponent', () => {
  let component: LeadDossierComponent;
  let fixture: ComponentFixture<LeadDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadDossierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
