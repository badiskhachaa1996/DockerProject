import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPdfHeaderEspicComponent } from './cv-pdf-header-espic.component';

describe('CvPdfHeaderEspicComponent', () => {
  let component: CvPdfHeaderEspicComponent;
  let fixture: ComponentFixture<CvPdfHeaderEspicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvPdfHeaderEspicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPdfHeaderEspicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
