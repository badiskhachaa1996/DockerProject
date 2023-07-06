import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailTypeComponent } from './mail.component';

describe('MailTypeComponent', () => {
  let component: MailTypeComponent;
  let fixture: ComponentFixture<MailTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
