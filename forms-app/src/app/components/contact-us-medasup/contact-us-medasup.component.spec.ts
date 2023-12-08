import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsMedasupComponent } from './contact-us-medasup.component';

describe('ContactUsMedasupComponent', () => {
  let component: ContactUsMedasupComponent;
  let fixture: ComponentFixture<ContactUsMedasupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsMedasupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsMedasupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
