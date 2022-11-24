import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseDoublonComponent } from './analyse-doublon.component';

describe('AnalyseDoublonComponent', () => {
  let component: AnalyseDoublonComponent;
  let fixture: ComponentFixture<AnalyseDoublonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyseDoublonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyseDoublonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
