import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnneeScolaireComponent } from './list-annee-scolaire.component';

describe('ListAnneeScolaireComponent', () => {
  let component: ListAnneeScolaireComponent;
  let fixture: ComponentFixture<ListAnneeScolaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAnneeScolaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAnneeScolaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
