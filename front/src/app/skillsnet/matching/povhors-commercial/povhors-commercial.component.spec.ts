import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POVHorsCommercialComponent } from './povhors-commercial.component';

describe('POVHorsCommercialComponent', () => {
  let component: POVHorsCommercialComponent;
  let fixture: ComponentFixture<POVHorsCommercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POVHorsCommercialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POVHorsCommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
