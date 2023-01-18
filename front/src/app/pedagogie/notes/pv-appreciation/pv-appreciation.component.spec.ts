import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvAppreciationComponent } from './pv-appreciation.component';

describe('PvAppreciationComponent', () => {
  let component: PvAppreciationComponent;
  let fixture: ComponentFixture<PvAppreciationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PvAppreciationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PvAppreciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
