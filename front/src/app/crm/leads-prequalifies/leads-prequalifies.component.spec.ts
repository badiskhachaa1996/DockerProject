import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsPrequalifiesComponent } from './leads-prequalifies.component';

describe('LeadsPrequalifiesComponent', () => {
  let component: LeadsPrequalifiesComponent;
  let fixture: ComponentFixture<LeadsPrequalifiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsPrequalifiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsPrequalifiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
