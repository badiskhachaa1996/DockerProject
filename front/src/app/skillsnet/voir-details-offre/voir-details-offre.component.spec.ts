import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirDetailsOffreComponent } from './voir-details-offre.component';

describe('VoirDetailsOffreComponent', () => {
  let component: VoirDetailsOffreComponent;
  let fixture: ComponentFixture<VoirDetailsOffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoirDetailsOffreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirDetailsOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
