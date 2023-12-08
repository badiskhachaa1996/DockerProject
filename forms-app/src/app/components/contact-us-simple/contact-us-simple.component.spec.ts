import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsSimpleComponent } from './contact-us-simple.component';

describe('ContactUsSimpleComponent', () => {
  let component: ContactUsSimpleComponent;
  let fixture: ComponentFixture<ContactUsSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsSimpleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
