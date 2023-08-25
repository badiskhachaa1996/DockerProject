import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationPointeuseComponent } from './configuration-pointeuse.component';

describe('ConfigurationPointeuseComponent', () => {
  let component: ConfigurationPointeuseComponent;
  let fixture: ComponentFixture<ConfigurationPointeuseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationPointeuseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationPointeuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
