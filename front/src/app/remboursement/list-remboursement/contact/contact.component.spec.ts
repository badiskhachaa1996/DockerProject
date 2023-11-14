import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRemboursementComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactRemboursementComponent;
  let fixture: ComponentFixture<ContactRemboursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactRemboursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
