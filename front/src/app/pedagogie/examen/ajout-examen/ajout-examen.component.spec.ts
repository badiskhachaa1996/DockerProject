import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutExamenComponent } from './ajout-examen.component';

describe('AjoutExamenComponent', () => {
  let component: AjoutExamenComponent;
  let fixture: ComponentFixture<AjoutExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutExamenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
