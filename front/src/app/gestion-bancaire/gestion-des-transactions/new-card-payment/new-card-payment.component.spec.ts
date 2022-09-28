import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCardPaymentComponent } from './new-card-payment.component';

describe('NewCardPaymentComponent', () => {
  let component: NewCardPaymentComponent;
  let fixture: ComponentFixture<NewCardPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCardPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCardPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
