import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvAnnuelComponent } from './pv-annuel.component';

describe('PvAnnuelComponent', () => {
  let component: PvAnnuelComponent;
  let fixture: ComponentFixture<PvAnnuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PvAnnuelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PvAnnuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
