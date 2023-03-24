import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutCollaborateurComponent } from './ajout-collaborateur.component';

describe('AjoutCollaborateurComponent', () => {
  let component: AjoutCollaborateurComponent;
  let fixture: ComponentFixture<AjoutCollaborateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutCollaborateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutCollaborateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
