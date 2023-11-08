import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfPreviewComponent } from './cv-pdf-preview.component';

describe('CvPdfPreviewComponent', () => {
  let component: CvPdfPreviewComponent;
  let fixture: ComponentFixture<CvPdfPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
