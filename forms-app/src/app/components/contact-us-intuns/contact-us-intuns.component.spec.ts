import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsIntunsComponent } from './contact-us-intuns.component';

describe('ContactUsIntunsComponent', () => {
  let component: ContactUsIntunsComponent;
  let fixture: ComponentFixture<ContactUsIntunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsIntunsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsIntunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
