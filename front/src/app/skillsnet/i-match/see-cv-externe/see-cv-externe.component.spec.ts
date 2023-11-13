import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeCvExterneComponent } from './see-cv-externe.component';

describe('SeeCvExterneComponent', () => {
  let component: SeeCvExterneComponent;
  let fixture: ComponentFixture<SeeCvExterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeCvExterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeCvExterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
