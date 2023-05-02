import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageCeoComponent } from './stage-ceo.component';

describe('StageCeoComponent', () => {
  let component: StageCeoComponent;
  let fixture: ComponentFixture<StageCeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageCeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StageCeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
