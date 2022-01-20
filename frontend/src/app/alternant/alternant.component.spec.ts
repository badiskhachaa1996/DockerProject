import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternantComponent } from './alternant.component';

describe('AlternantComponent', () => {
  let component: AlternantComponent;
  let fixture: ComponentFixture<AlternantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
