import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsIcbsComponent } from './contact-us-icbs.component';

describe('ContactUsIcbsComponent', () => {
  let component: ContactUsIcbsComponent;
  let fixture: ComponentFixture<ContactUsIcbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsIcbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsIcbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
