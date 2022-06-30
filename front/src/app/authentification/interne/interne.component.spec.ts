import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterneComponent } from './interne.component';

describe('InterneComponent', () => {
  let component: InterneComponent;
  let fixture: ComponentFixture<InterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
