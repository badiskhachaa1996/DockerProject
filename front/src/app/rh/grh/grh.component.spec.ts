import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrhComponent } from './grh.component';

describe('GrhComponent', () => {
  let component: GrhComponent;
  let fixture: ComponentFixture<GrhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
