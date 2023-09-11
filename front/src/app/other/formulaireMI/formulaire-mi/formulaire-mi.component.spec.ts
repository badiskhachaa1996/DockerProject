import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireMIComponent } from './formulaire-mi.component';

describe('FormulaireMIComponent', () => {
  let component: FormulaireMIComponent;
  let fixture: ComponentFixture<FormulaireMIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireMIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireMIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
