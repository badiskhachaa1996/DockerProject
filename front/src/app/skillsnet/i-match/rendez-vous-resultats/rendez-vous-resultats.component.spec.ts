import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezVousResultatsComponent } from './rendez-vous-resultats.component';

describe('RendezVousResultatsComponent', () => {
  let component: RendezVousResultatsComponent;
  let fixture: ComponentFixture<RendezVousResultatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RendezVousResultatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RendezVousResultatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
