import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenIntroComponent } from './gen-intro.component';

describe('GenIntroComponent', () => {
  let component: GenIntroComponent;
  let fixture: ComponentFixture<GenIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenIntroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
