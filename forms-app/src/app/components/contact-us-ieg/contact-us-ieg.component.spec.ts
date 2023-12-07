import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsIegComponent } from './contact-us-ieg.component';

describe('ContactUsIegComponent', () => {
  let component: ContactUsIegComponent;
  let fixture: ComponentFixture<ContactUsIegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsIegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsIegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
