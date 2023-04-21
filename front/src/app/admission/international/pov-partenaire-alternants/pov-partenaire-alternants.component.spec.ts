import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PovPartenaireAlternantsComponent } from './pov-partenaire-alternants.component';

describe('PovPartenaireAlternantsComponent', () => {
  let component: PovPartenaireAlternantsComponent;
  let fixture: ComponentFixture<PovPartenaireAlternantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PovPartenaireAlternantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PovPartenaireAlternantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
