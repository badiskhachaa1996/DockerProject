import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantsIntunsComponent } from './etudiants-intuns.component';

describe('EtudiantsIntunsComponent', () => {
  let component: EtudiantsIntunsComponent;
  let fixture: ComponentFixture<EtudiantsIntunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtudiantsIntunsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantsIntunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
