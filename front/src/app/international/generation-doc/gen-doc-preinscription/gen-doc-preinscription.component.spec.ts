import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDocPreinscriptionComponent } from './gen-doc-preinscription.component';

describe('GenDocPreinscriptionComponent', () => {
  let component: GenDocPreinscriptionComponent;
  let fixture: ComponentFixture<GenDocPreinscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenDocPreinscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenDocPreinscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
