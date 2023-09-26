import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImatchCandidatComponent } from './imatch-candidat.component';

describe('ImatchCandidatComponent', () => {
  let component: ImatchCandidatComponent;
  let fixture: ComponentFixture<ImatchCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImatchCandidatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImatchCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
