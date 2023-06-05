import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsQualifiesComponent } from './leads-qualifies.component';

describe('LeadsQualifiesComponent', () => {
  let component: LeadsQualifiesComponent;
  let fixture: ComponentFixture<LeadsQualifiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsQualifiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsQualifiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
