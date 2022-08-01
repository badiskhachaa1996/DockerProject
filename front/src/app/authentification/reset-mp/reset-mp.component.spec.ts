import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetMpComponent } from './reset-mp.component';

describe('ResetMpComponent', () => {
  let component: ResetMpComponent;
  let fixture: ComponentFixture<ResetMpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetMpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetMpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
