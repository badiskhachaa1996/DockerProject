import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviCandidatComponent } from './suivi-candidat.component';

describe('SuiviCandidatComponent', () => {
  let component: SuiviCandidatComponent;
  let fixture: ComponentFixture<SuiviCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviCandidatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
