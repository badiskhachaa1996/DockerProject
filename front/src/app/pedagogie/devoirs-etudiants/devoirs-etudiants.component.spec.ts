import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoirsEtudiantsComponent } from './devoirs-etudiants.component';

describe('DevoirsEtudiantsComponent', () => {
  let component: DevoirsEtudiantsComponent;
  let fixture: ComponentFixture<DevoirsEtudiantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoirsEtudiantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevoirsEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
