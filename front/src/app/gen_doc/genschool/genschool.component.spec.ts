import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenschoolComponent } from './genschool.component';

describe('GenschoolComponent', () => {
  let component: GenschoolComponent;
  let fixture: ComponentFixture<GenschoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenschoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
