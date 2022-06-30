import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiplomeComponent } from './add-diplome.component';

describe('AddDiplomeComponent', () => {
  let component: AddDiplomeComponent;
  let fixture: ComponentFixture<AddDiplomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDiplomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiplomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
