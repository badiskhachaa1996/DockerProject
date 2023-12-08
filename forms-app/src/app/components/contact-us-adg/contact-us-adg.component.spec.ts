import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsAdgComponent } from './contact-us-adg.component';

describe('ContactUsAdgComponent', () => {
  let component: ContactUsAdgComponent;
  let fixture: ComponentFixture<ContactUsAdgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsAdgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsAdgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
