import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvEtudiantComponent } from './cv-etudiant.component';

describe('CvEtudiantComponent', () => {
  let component: CvEtudiantComponent;
  let fixture: ComponentFixture<CvEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvEtudiantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
