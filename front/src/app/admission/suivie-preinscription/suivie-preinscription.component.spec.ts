import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviePreinscriptionComponent } from './suivie-preinscription.component';

describe('SuiviePreinscriptionComponent', () => {
  let component: SuiviePreinscriptionComponent;
  let fixture: ComponentFixture<SuiviePreinscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuiviePreinscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviePreinscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
