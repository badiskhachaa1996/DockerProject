import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesComptesComponent } from './liste-des-comptes.component';

describe('ListeDesComptesComponent', () => {
  let component: ListeDesComptesComponent;
  let fixture: ComponentFixture<ListeDesComptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeDesComptesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeDesComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
