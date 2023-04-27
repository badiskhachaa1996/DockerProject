import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutAlternantPartenaireComponent } from './ajout-alternant-partenaire.component';

describe('AjoutAlternantPartenaireComponent', () => {
  let component: AjoutAlternantPartenaireComponent;
  let fixture: ComponentFixture<AjoutAlternantPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutAlternantPartenaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutAlternantPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
