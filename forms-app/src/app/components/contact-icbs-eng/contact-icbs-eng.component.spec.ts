import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactIcbsEngComponent } from './contact-icbs-eng.component';

describe('ContactIcbsEngComponent', () => {
  let component: ContactIcbsEngComponent;
  let fixture: ComponentFixture<ContactIcbsEngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactIcbsEngComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactIcbsEngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
