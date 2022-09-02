import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEventsComponent } from './demande-events.component';

describe('DemandeEventsComponent', () => {
  let component: DemandeEventsComponent;
  let fixture: ComponentFixture<DemandeEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
