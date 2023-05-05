import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDocInscriptionComponent } from './gen-doc-inscription.component';

describe('GenDocInscriptionComponent', () => {
  let component: GenDocInscriptionComponent;
  let fixture: ComponentFixture<GenDocInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenDocInscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenDocInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
