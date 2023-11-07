import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfSidebarComponent } from './cv-pdf-sidebar.component';

describe('CvPdfSidebarComponent', () => {
  let component: CvPdfSidebarComponent;
  let fixture: ComponentFixture<CvPdfSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
