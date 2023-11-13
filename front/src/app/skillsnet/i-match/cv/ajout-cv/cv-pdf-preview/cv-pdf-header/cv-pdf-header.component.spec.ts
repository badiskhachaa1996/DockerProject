import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfHeaderComponent } from './cv-pdf-header.component';

describe('CvPdfHeaderComponent', () => {
  let component: CvPdfHeaderComponent;
  let fixture: ComponentFixture<CvPdfHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
