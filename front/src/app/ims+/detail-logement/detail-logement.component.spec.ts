import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLogementComponent } from './detail-logement.component';

describe('DetailLogementComponent', () => {
  let component: DetailLogementComponent;
  let fixture: ComponentFixture<DetailLogementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailLogementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLogementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
