import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfHeaderAdgComponent } from './cv-pdf-header-adg.component';

describe('CvPdfHeaderAdgComponent', () => {
  let component: CvPdfHeaderAdgComponent;
  let fixture: ComponentFixture<CvPdfHeaderAdgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfHeaderAdgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfHeaderAdgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
