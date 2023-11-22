import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentaireSectionComponent } from './commentaire-section.component';

describe('CommentaireSectionComponent', () => {
  let component: CommentaireSectionComponent;
  let fixture: ComponentFixture<CommentaireSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentaireSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentaireSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
