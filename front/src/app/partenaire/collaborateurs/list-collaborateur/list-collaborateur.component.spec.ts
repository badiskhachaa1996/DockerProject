import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCollaborateurComponent } from './list-collaborateur.component';

describe('ListCollaborateurComponent', () => {
  let component: ListCollaborateurComponent;
  let fixture: ComponentFixture<ListCollaborateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCollaborateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCollaborateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
