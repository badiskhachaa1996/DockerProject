import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTargetComponent } from './my-target.component';

describe('MyTargetComponent', () => {
  let component: MyTargetComponent;
  let fixture: ComponentFixture<MyTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
