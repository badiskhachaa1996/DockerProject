import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelUrlComponent } from './cancel-url.component';

describe('CancelUrlComponent', () => {
  let component: CancelUrlComponent;
  let fixture: ComponentFixture<CancelUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
