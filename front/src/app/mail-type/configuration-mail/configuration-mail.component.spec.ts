import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationMailComponent } from './configuration-mail.component';

describe('ConfigurationMailComponent', () => {
  let component: ConfigurationMailComponent;
  let fixture: ComponentFixture<ConfigurationMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
