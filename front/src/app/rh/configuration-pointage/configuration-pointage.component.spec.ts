import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationPointageComponent } from './configuration-pointage.component';

describe('ConfigurationPointageComponent', () => {
  let component: ConfigurationPointageComponent;
  let fixture: ComponentFixture<ConfigurationPointageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationPointageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationPointageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
