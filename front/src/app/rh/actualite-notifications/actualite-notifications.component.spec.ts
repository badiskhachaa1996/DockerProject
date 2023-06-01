import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteNotificationsComponent } from './actualite-notifications.component';

describe('ActualiteNotificationsComponent', () => {
  let component: ActualiteNotificationsComponent;
  let fixture: ComponentFixture<ActualiteNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualiteNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualiteNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
