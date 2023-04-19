import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployabiliteComponent } from './employabilite.component';

describe('EmployabiliteComponent', () => {
  let component: EmployabiliteComponent;
  let fixture: ComponentFixture<EmployabiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployabiliteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployabiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
