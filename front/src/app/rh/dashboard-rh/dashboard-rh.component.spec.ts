import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRhComponent } from './dashboard-rh.component';

describe('DashboardRhComponent', () => {
  let component: DashboardRhComponent;
  let fixture: ComponentFixture<DashboardRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
