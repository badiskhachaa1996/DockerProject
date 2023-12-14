import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsStudinfoComponent } from './contact-us-studinfo.component';

describe('ContactUsStudinfoComponent', () => {
  let component: ContactUsStudinfoComponent;
  let fixture: ComponentFixture<ContactUsStudinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsStudinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsStudinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
