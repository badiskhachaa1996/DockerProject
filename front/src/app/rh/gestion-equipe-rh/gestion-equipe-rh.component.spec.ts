import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEquipeRhComponent } from './gestion-equipe-rh.component';

describe('GestionEquipeRhComponent', () => {
  let component: GestionEquipeRhComponent;
  let fixture: ComponentFixture<GestionEquipeRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionEquipeRhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEquipeRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
