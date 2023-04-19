import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentreeScolaireAdmissionComponent } from './rentree-scolaire-admission.component';

describe('RentreeScolaireAdmissionComponent', () => {
  let component: RentreeScolaireAdmissionComponent;
  let fixture: ComponentFixture<RentreeScolaireAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentreeScolaireAdmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentreeScolaireAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
