import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicketsRefuseComponent } from './list-tickets-refuse.component';

describe('ListTicketsRefuseComponent', () => {
  let component: ListTicketsRefuseComponent;
  let fixture: ComponentFixture<ListTicketsRefuseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTicketsRefuseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketsRefuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
