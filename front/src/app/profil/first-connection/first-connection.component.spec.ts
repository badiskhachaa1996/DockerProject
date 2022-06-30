import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstConnectionComponent } from './first-connection.component';

describe('FirstConnectionComponent', () => {
  let component: FirstConnectionComponent;
  let fixture: ComponentFixture<FirstConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstConnectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
