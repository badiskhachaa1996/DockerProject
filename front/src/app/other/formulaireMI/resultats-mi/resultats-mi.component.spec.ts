import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsMIComponent } from './resultats-mi.component';

describe('ResultatsMIComponent', () => {
  let component: ResultatsMIComponent;
  let fixture: ComponentFixture<ResultatsMIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultatsMIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatsMIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
