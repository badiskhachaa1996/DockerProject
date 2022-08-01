import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpOublieComponent } from './mp-oublie.component';

describe('MpOublieComponent', () => {
  let component: MpOublieComponent;
  let fixture: ComponentFixture<MpOublieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpOublieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpOublieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
