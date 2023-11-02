import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardImatchComponent } from './dashboard-imatch.component';

describe('DashboardImatchComponent', () => {
  let component: DashboardImatchComponent;
  let fixture: ComponentFixture<DashboardImatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardImatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardImatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
