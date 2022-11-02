import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewIndividualAccountComponent } from './add-new-individual-account.component';

describe('AddNewIndividualAccountComponent', () => {
  let component: AddNewIndividualAccountComponent;
  let fixture: ComponentFixture<AddNewIndividualAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewIndividualAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewIndividualAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
