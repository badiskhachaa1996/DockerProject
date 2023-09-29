import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewListTicketsComponent } from './new-list-tickets.component';

describe('NewListTicketsComponent', () => {
  let component: NewListTicketsComponent;
  let fixture: ComponentFixture<NewListTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewListTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewListTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
