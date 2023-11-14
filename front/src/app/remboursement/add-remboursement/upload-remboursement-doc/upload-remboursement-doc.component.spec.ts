import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRemboursementDocComponent } from './upload-remboursement-doc.component';

describe('UploadRemboursementDocComponent', () => {
  let component: UploadRemboursementDocComponent;
  let fixture: ComponentFixture<UploadRemboursementDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadRemboursementDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRemboursementDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
