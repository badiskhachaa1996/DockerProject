import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnUrlComponent } from './return-url.component';

describe('ReturnUrlComponent', () => {
  let component: ReturnUrlComponent;
  let fixture: ComponentFixture<ReturnUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
