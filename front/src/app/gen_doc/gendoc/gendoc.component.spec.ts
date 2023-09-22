import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GendocComponent } from './gendoc.component';

describe('GendocComponent', () => {
  let component: GendocComponent;
  let fixture: ComponentFixture<GendocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GendocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GendocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
