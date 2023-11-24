import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSrourcesComponent } from './gestion-srources.component';

describe('GestionSrourcesComponent', () => {
  let component: GestionSrourcesComponent;
  let fixture: ComponentFixture<GestionSrourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionSrourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionSrourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
