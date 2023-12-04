import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupeV2Component } from './add-groupe-v2.component';

describe('AddGroupeV2Component', () => {
  let component: AddGroupeV2Component;
  let fixture: ComponentFixture<AddGroupeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupeV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
