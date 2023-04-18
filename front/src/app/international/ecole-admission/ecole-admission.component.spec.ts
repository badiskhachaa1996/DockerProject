import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoleAdmissionComponent } from './ecole-admission.component';

describe('EcoleAdmissionComponent', () => {
  let component: EcoleAdmissionComponent;
  let fixture: ComponentFixture<EcoleAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcoleAdmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoleAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
