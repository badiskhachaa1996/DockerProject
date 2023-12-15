import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsIcbsEngComponent } from './contact-us-icbs-eng.component';

describe('ContactUsIcbsEngComponent', () => {
  let component: ContactUsIcbsEngComponent;
  let fixture: ComponentFixture<ContactUsIcbsEngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsIcbsEngComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsIcbsEngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
