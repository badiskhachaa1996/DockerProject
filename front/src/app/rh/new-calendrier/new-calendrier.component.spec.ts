import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalendrierComponent } from './new-calendrier.component';

describe('NewCalendrierComponent', () => {
  let component: NewCalendrierComponent;
  let fixture: ComponentFixture<NewCalendrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalendrierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCalendrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
