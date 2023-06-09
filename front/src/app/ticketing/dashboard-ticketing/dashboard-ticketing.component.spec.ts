import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTicketingComponent } from './dashboard-ticketing.component';

describe('DashboardTicketingComponent', () => {
  let component: DashboardTicketingComponent;
  let fixture: ComponentFixture<DashboardTicketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTicketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTicketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
