import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsNonQualifiesComponent } from './leads-non-qualifies.component';

describe('LeadsNonQualifiesComponent', () => {
  let component: LeadsNonQualifiesComponent;
  let fixture: ComponentFixture<LeadsNonQualifiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsNonQualifiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsNonQualifiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
