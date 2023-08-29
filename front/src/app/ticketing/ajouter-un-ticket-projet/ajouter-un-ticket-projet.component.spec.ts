import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterUnTicketProjetComponent } from './ajouter-un-ticket-projet.component';

describe('AjouterUnTicketProjetComponent', () => {
  let component: AjouterUnTicketProjetComponent;
  let fixture: ComponentFixture<AjouterUnTicketProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterUnTicketProjetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterUnTicketProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
