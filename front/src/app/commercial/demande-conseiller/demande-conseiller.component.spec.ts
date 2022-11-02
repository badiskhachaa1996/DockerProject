import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeConseillerComponent } from './demande-conseiller.component';

describe('DemandeConseillerComponent', () => {
  let component: DemandeConseillerComponent;
  let fixture: ComponentFixture<DemandeConseillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeConseillerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeConseillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
