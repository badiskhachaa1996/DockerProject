import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntreprisesComponent } from './new-entreprises.component';

describe('NewEntreprisesComponent', () => {
  let component: NewEntreprisesComponent;
  let fixture: ComponentFixture<NewEntreprisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEntreprisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEntreprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
