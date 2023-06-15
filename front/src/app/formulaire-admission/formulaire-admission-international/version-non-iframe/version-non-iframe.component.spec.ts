import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionNonIframeComponent } from './version-non-iframe.component';

describe('VersionNonIframeComponent', () => {
  let component: VersionNonIframeComponent;
  let fixture: ComponentFixture<VersionNonIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionNonIframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionNonIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
