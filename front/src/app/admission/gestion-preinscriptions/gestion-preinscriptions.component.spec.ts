import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPreinscriptionsComponent } from './gestion-preinscriptions.component';

describe('GestionPreinscriptionsComponent', () => {
  let component: GestionPreinscriptionsComponent;
  let fixture: ComponentFixture<GestionPreinscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPreinscriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPreinscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
