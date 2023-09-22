import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseDashboardComponent } from './entreprise-dashboard.component';

describe('EntrepriseDashboardComponent', () => {
  let component: EntrepriseDashboardComponent;
  let fixture: ComponentFixture<EntrepriseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrepriseDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrepriseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
