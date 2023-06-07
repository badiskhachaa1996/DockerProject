import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicketsEnAttenteDeTraitementComponent } from './list-tickets-en-attente-de-traitement.component';

describe('ListTicketsEnAttenteDeTraitementComponent', () => {
  let component: ListTicketsEnAttenteDeTraitementComponent;
  let fixture: ComponentFixture<ListTicketsEnAttenteDeTraitementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTicketsEnAttenteDeTraitementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketsEnAttenteDeTraitementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
