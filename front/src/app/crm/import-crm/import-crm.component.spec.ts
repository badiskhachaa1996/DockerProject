import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCrmComponent } from './import-crm.component';

describe('ImportCrmComponent', () => {
  let component: ImportCrmComponent;
  let fixture: ComponentFixture<ImportCrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
