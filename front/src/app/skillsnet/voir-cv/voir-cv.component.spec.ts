import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirCvComponent } from './voir-cv.component';

describe('VoirCvComponent', () => {
  let component: VoirCvComponent;
  let fixture: ComponentFixture<VoirCvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoirCvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
