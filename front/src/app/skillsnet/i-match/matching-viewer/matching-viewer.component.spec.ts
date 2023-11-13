import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingViewerComponent } from './matching-viewer.component';

describe('MatchingViewerComponent', () => {
  let component: MatchingViewerComponent;
  let fixture: ComponentFixture<MatchingViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchingViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
