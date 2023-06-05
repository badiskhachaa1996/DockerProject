import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsAssignesComponent } from './tickets-assignes.component';

describe('TicketsAssignesComponent', () => {
  let component: TicketsAssignesComponent;
  let fixture: ComponentFixture<TicketsAssignesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsAssignesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsAssignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
