import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsEspicComponent } from './contact-us-espic.component';

describe('ContactUsEspicComponent', () => {
  let component: ContactUsEspicComponent;
  let fixture: ComponentFixture<ContactUsEspicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsEspicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsEspicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
