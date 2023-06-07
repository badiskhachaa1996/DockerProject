import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicketsAssignesComponent } from './list-tickets-assignes.component';

describe('ListTicketsAssignesComponent', () => {
  let component: ListTicketsAssignesComponent;
  let fixture: ComponentFixture<ListTicketsAssignesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTicketsAssignesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketsAssignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
