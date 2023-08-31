import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierRhComponent } from './calendrier-rh.component';

describe('CalendrierRhComponent', () => {
  let component: CalendrierRhComponent;
  let fixture: ComponentFixture<CalendrierRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendrierRhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendrierRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
