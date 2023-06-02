import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentesCRMComponent } from './ventes-crm.component';

describe('VentesCRMComponent', () => {
  let component: VentesCRMComponent;
  let fixture: ComponentFixture<VentesCRMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentesCRMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentesCRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
