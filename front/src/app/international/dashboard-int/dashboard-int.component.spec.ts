import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIntComponent } from './dashboard-int.component';

describe('DashboardIntComponent', () => {
  let component: DashboardIntComponent;
  let fixture: ComponentFixture<DashboardIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
