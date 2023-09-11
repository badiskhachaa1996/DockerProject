import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationMIComponent } from './configuration-mi.component';

describe('ConfigurationMIComponent', () => {
  let component: ConfigurationMIComponent;
  let fixture: ComponentFixture<ConfigurationMIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationMIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationMIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
