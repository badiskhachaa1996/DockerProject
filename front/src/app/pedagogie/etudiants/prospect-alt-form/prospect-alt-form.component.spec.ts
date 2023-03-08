import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectAltFormComponent } from './prospect-alt-form.component';

describe('ProspectAltFormComponent', () => {
  let component: ProspectAltFormComponent;
  let fixture: ComponentFixture<ProspectAltFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectAltFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectAltFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
