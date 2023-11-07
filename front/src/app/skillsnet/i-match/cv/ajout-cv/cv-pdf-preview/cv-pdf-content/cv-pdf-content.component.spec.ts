import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfContentComponent } from './cv-pdf-content.component';

describe('CvPdfContentComponent', () => {
  let component: CvPdfContentComponent;
  let fixture: ComponentFixture<CvPdfContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
