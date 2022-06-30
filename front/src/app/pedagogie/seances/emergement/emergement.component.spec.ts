import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergementComponent } from './emergement.component';

describe('EmergementComponent', () => {
  let component: EmergementComponent;
  let fixture: ComponentFixture<EmergementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
