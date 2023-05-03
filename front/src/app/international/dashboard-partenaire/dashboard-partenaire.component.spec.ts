import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPartenaireComponent } from './dashboard-partenaire.component';

describe('DashboardPartenaireComponent', () => {
  let component: DashboardPartenaireComponent;
  let fixture: ComponentFixture<DashboardPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPartenaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
