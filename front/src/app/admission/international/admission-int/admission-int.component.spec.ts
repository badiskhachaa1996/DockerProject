import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionIntComponent } from './admission-int.component';

describe('AdmissionIntComponent', () => {
  let component: AdmissionIntComponent;
  let fixture: ComponentFixture<AdmissionIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
