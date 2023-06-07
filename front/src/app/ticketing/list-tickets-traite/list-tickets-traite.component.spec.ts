import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicketsTraiteComponent } from './list-tickets-traite.component';

describe('ListTicketsTraiteComponent', () => {
  let component: ListTicketsTraiteComponent;
  let fixture: ComponentFixture<ListTicketsTraiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTicketsTraiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketsTraiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
