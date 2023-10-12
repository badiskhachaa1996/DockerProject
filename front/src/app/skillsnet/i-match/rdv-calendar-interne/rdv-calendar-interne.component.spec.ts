import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvCalendarInterneComponent } from './rdv-calendar-interne.component';

describe('RdvCalendarInterneComponent', () => {
  let component: RdvCalendarInterneComponent;
  let fixture: ComponentFixture<RdvCalendarInterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdvCalendarInterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdvCalendarInterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
