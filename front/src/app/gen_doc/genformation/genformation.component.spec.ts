import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenformationComponent } from './genformation.component';

describe('GenformationComponent', () => {
  let component: GenformationComponent;
  let fixture: ComponentFixture<GenformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
