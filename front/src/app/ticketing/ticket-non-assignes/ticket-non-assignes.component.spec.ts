import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketNonAssignesComponent } from './ticket-non-assignes.component';

describe('TicketNonAssignesComponent', () => {
  let component: TicketNonAssignesComponent;
  let fixture: ComponentFixture<TicketNonAssignesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketNonAssignesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketNonAssignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
