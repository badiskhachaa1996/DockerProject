import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEcoleComponent } from './add-ecole.component';

describe('AddEcoleComponent', () => {
  let component: AddEcoleComponent;
  let fixture: ComponentFixture<AddEcoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEcoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEcoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
