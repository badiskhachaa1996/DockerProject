import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadPaiementsComponent } from './lead-paiements.component';

describe('LeadPaiementsComponent', () => {
  let component: LeadPaiementsComponent;
  let fixture: ComponentFixture<LeadPaiementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadPaiementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
