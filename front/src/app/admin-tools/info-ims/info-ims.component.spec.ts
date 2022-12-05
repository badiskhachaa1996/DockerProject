import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoImsComponent } from './info-ims.component';

describe('InfoImsComponent', () => {
  let component: InfoImsComponent;
  let fixture: ComponentFixture<InfoImsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoImsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoImsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
