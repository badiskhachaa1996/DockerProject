import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCandidatureComponent } from './preview-candidature.component';

describe('PreviewCandidatureComponent', () => {
  let component: PreviewCandidatureComponent;
  let fixture: ComponentFixture<PreviewCandidatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewCandidatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
