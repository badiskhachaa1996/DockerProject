import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailAutoComponent } from './mail-auto.component';

describe('MailAutoComponent', () => {
  let component: MailAutoComponent;
  let fixture: ComponentFixture<MailAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailAutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
