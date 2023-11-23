import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLogementComponent } from './gestion-logement.component';

describe('GestionLogementComponent', () => {
  let component: GestionLogementComponent;
  let fixture: ComponentFixture<GestionLogementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionLogementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionLogementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
