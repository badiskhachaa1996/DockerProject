import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinscritComponent } from './reinscrit.component';

describe('ReinscritComponent', () => {
  let component: ReinscritComponent;
  let fixture: ComponentFixture<ReinscritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReinscritComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinscritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
