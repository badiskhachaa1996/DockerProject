import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesReclamationsComponent } from './demandes-reclamations.component';

describe('DemandesReclamationsComponent', () => {
  let component: DemandesReclamationsComponent;
  let fixture: ComponentFixture<DemandesReclamationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandesReclamationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandesReclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
