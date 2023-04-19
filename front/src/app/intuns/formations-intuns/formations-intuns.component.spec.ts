import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsIntunsComponent } from './formations-intuns.component';

describe('FormationsIntunsComponent', () => {
  let component: FormationsIntunsComponent;
  let fixture: ComponentFixture<FormationsIntunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationsIntunsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationsIntunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
