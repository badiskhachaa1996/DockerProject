import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCandidatComponent } from './details-candidat.component';

describe('DetailsCandidatComponent', () => {
  let component: DetailsCandidatComponent;
  let fixture: ComponentFixture<DetailsCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsCandidatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
