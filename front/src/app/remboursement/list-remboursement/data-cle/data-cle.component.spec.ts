import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCleComponent } from './data-cle.component';

describe('DataCleComponent', () => {
  let component: DataCleComponent;
  let fixture: ComponentFixture<DataCleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
