import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderImatchComponent } from './header-imatch.component';

describe('HeaderImatchComponent', () => {
  let component: HeaderImatchComponent;
  let fixture: ComponentFixture<HeaderImatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderImatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderImatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
