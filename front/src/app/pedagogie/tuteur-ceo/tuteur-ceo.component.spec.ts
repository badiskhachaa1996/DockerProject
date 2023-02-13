import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuteurCeoComponent } from './tuteur-ceo.component';

describe('TuteurCeoComponent', () => {
  let component: TuteurCeoComponent;
  let fixture: ComponentFixture<TuteurCeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TuteurCeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TuteurCeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
