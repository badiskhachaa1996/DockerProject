import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTargetComponent } from './configuration-target.component';

describe('ConfigurationTargetComponent', () => {
  let component: ConfigurationTargetComponent;
  let fixture: ComponentFixture<ConfigurationTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
