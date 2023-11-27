import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemboursementPublicComponent } from './add-remboursement-public.component';

describe('AddRemboursementPublicComponent', () => {
  let component: AddRemboursementPublicComponent;
  let fixture: ComponentFixture<AddRemboursementPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemboursementPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemboursementPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
