import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfHeaderBtechComponent } from './cv-pdf-header-btech.component';

describe('CvPdfHeaderBtechComponent', () => {
  let component: CvPdfHeaderBtechComponent;
  let fixture: ComponentFixture<CvPdfHeaderBtechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfHeaderBtechComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfHeaderBtechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
