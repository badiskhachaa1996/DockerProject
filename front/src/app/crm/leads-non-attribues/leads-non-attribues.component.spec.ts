import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsNonAttribuesComponent } from './leads-non-attribues.component';

describe('LeadsNonAttribuesComponent', () => {
  let component: LeadsNonAttribuesComponent;
  let fixture: ComponentFixture<LeadsNonAttribuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsNonAttribuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsNonAttribuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
