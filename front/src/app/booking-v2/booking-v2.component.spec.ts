import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingV2Component } from './booking-v2.component';

describe('BookingV2Component', () => {
  let component: BookingV2Component;
  let fixture: ComponentFixture<BookingV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
