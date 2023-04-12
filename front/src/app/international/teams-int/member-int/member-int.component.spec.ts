import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberIntComponent } from './member-int.component';

describe('MemberIntComponent', () => {
  let component: MemberIntComponent;
  let fixture: ComponentFixture<MemberIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
