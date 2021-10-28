import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstconnectionComponent } from './firstconnection.component';

describe('FirstconnectionComponent', () => {
  let component: FirstconnectionComponent;
  let fixture: ComponentFixture<FirstconnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstconnectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
