import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectsAlternablesComponent } from './prospects-alternables.component';

describe('ProspectsAlternablesComponent', () => {
  let component: ProspectsAlternablesComponent;
  let fixture: ComponentFixture<ProspectsAlternablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectsAlternablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectsAlternablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
