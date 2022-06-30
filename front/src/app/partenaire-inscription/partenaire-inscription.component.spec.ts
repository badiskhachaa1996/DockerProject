import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenaireInscriptionComponent } from './partenaire-inscription.component';

describe('PartenaireInscriptionComponent', () => {
  let component: PartenaireInscriptionComponent;
  let fixture: ComponentFixture<PartenaireInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartenaireInscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartenaireInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
