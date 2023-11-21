import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsCandidatureViewerComponent } from './documents-candidature-viewer.component';

describe('DocumentsCandidatureViewerComponent', () => {
  let component: DocumentsCandidatureViewerComponent;
  let fixture: ComponentFixture<DocumentsCandidatureViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsCandidatureViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsCandidatureViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
