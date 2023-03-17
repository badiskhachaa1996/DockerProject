import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatQfComponent } from './resultat-qf.component';

describe('ResultatQfComponent', () => {
  let component: ResultatQfComponent;
  let fixture: ComponentFixture<ResultatQfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultatQfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatQfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
