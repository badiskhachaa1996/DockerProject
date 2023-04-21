import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PovPartenaireListProspectsComponent } from './pov-partenaire-list-prospects.component';

describe('PovPartenaireListProspectsComponent', () => {
  let component: PovPartenaireListProspectsComponent;
  let fixture: ComponentFixture<PovPartenaireListProspectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PovPartenaireListProspectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PovPartenaireListProspectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
