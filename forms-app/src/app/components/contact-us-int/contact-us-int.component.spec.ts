import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsIntComponent } from './contact-us-int.component';

describe('ContactUsIntComponent', () => {
  let component: ContactUsIntComponent;
  let fixture: ComponentFixture<ContactUsIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsIntComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
