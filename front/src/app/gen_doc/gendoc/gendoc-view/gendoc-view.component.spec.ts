import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GendocViewComponent } from './gendoc-view.component';

describe('GendocViewComponent', () => {
  let component: GendocViewComponent;
  let fixture: ComponentFixture<GendocViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GendocViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GendocViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
