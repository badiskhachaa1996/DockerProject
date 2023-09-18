import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GencampusComponent } from './gencampus.component';

describe('GencampusComponent', () => {
  let component: GencampusComponent;
  let fixture: ComponentFixture<GencampusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GencampusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GencampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
