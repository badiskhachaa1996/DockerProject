import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfHeaderMedasupComponent } from './cv-pdf-header-medasup.component';

describe('CvPdfHeaderMedasupComponent', () => {
  let component: CvPdfHeaderMedasupComponent;
  let fixture: ComponentFixture<CvPdfHeaderMedasupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfHeaderMedasupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfHeaderMedasupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
