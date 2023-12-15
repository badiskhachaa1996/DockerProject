import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatisationTicketingComponent } from './automatisation-ticketing.component';

describe('AutomatisationTicketingComponent', () => {
  let component: AutomatisationTicketingComponent;
  let fixture: ComponentFixture<AutomatisationTicketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatisationTicketingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatisationTicketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
