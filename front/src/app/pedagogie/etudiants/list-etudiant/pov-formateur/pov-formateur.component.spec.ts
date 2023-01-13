import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PovFormateurComponent } from './pov-formateur.component';

describe('PovFormateurComponent', () => {
  let component: PovFormateurComponent;
  let fixture: ComponentFixture<PovFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PovFormateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PovFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
