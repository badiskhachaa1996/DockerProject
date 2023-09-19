import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireFrontComponent } from './formulaire-front.component';

describe('FormulaireFrontComponent', () => {
  let component: FormulaireFrontComponent;
  let fixture: ComponentFixture<FormulaireFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireFrontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
