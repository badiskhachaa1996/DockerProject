import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppreciationInputComponent } from './appreciation-input.component';

describe('AppreciationInputComponent', () => {
  let component: AppreciationInputComponent;
  let fixture: ComponentFixture<AppreciationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppreciationInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppreciationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
