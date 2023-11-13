import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvLoaderPreviewComponent } from './cv-loader-preview.component';

describe('CvLoaderPreviewComponent', () => {
  let component: CvLoaderPreviewComponent;
  let fixture: ComponentFixture<CvLoaderPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvLoaderPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvLoaderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
