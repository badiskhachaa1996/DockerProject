import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutTicketComponent } from './ajout-ticket.component';

describe('AjoutTicketComponent', () => {
  let component: AjoutTicketComponent;
  let fixture: ComponentFixture<AjoutTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
