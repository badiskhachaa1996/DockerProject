import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLeadcrmComponent } from './list-leadcrm.component';

describe('ListLeadcrmComponent', () => {
  let component: ListLeadcrmComponent;
  let fixture: ComponentFixture<ListLeadcrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLeadcrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeadcrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
