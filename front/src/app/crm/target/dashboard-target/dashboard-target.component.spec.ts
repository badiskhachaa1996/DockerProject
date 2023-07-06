import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTargetComponent } from './dashboard-target.component';

describe('DashboardTargetComponent', () => {
  let component: DashboardTargetComponent;
  let fixture: ComponentFixture<DashboardTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
