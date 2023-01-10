import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectsIntunsComponent } from './prospects-intuns.component';

describe('ProspectsIntunsComponent', () => {
  let component: ProspectsIntunsComponent;
  let fixture: ComponentFixture<ProspectsIntunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectsIntunsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectsIntunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
