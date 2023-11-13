import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfHeaderStudinfoComponent } from './cv-pdf-header-studinfo.component';

describe('CvPdfHeaderStudinfoComponent', () => {
  let component: CvPdfHeaderStudinfoComponent;
  let fixture: ComponentFixture<CvPdfHeaderStudinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfHeaderStudinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfHeaderStudinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
