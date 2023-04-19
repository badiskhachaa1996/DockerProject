import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulaireComponent } from './consulaire.component';

describe('ConsulaireComponent', () => {
  let component: ConsulaireComponent;
  let fixture: ComponentFixture<ConsulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsulaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
