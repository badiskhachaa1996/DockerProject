import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementInformationComponent } from './payement-information.component';

describe('PayementInformationComponent', () => {
  let component: PayementInformationComponent;
  let fixture: ComponentFixture<PayementInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayementInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayementInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
