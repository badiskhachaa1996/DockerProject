import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlternanceComponent } from './dashboard-alternance.component';

describe('DashboardAlternanceComponent', () => {
  let component: DashboardAlternanceComponent;
  let fixture: ComponentFixture<DashboardAlternanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAlternanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAlternanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
