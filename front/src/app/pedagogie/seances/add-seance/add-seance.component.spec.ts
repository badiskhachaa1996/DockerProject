import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeanceComponent } from './add-seance.component';

describe('AddSeanceComponent', () => {
  let component: AddSeanceComponent;
  let fixture: ComponentFixture<AddSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSeanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
