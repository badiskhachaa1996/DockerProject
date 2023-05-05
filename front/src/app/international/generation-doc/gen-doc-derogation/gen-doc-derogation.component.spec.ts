import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDocDerogationComponent } from './gen-doc-derogation.component';

describe('GenDocDerogationComponent', () => {
  let component: GenDocDerogationComponent;
  let fixture: ComponentFixture<GenDocDerogationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenDocDerogationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenDocDerogationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
