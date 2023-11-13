import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationRemboursementComponent } from './information-remboursement.component';

describe('InformationRemboursementComponent', () => {
  let component: InformationRemboursementComponent;
  let fixture: ComponentFixture<InformationRemboursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationRemboursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationRemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
