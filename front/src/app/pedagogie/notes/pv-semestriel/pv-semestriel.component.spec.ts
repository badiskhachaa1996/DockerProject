import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvSemestrielComponent } from './pv-semestriel.component';

describe('PvSemestrielComponent', () => {
  let component: PvSemestrielComponent;
  let fixture: ComponentFixture<PvSemestrielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PvSemestrielComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PvSemestrielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
