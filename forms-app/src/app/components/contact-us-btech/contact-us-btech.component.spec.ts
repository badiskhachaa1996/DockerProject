import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsBtechComponent } from './contact-us-btech.component';

describe('ContactUsSimpleComponent', () => {
  let component: ContactUsBtechComponent;
  let fixture: ComponentFixture<ContactUsBtechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsBtechComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsBtechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
