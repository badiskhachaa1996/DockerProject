import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrmExtComponent } from './form-crm-ext.component';

describe('FormCrmExtComponent', () => {
  let component: FormCrmExtComponent;
  let fixture: ComponentFixture<FormCrmExtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCrmExtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCrmExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
