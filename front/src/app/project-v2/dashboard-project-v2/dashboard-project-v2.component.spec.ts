import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProjectV2Component } from './dashboard-project-v2.component';

describe('DashboardProjectV2Component', () => {
  let component: DashboardProjectV2Component;
  let fixture: ComponentFixture<DashboardProjectV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardProjectV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProjectV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
