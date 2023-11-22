import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCvthequeInterneComponent } from './new-cvtheque-interne.component';

describe('NewCvthequeInterneComponent', () => {
  let component: NewCvthequeInterneComponent;
  let fixture: ComponentFixture<NewCvthequeInterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCvthequeInterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCvthequeInterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
