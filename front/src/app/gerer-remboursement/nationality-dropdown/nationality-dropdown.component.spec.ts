import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityDropdownComponent } from './nationality-dropdown.component';

describe('NationalityDropdownComponent', () => {
  let component: NationalityDropdownComponent;
  let fixture: ComponentFixture<NationalityDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalityDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
