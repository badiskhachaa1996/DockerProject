import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialiserMdpComponent } from './initialiser-mdp.component';

describe('InitialiserMdpComponent', () => {
  let component: InitialiserMdpComponent;
  let fixture: ComponentFixture<InitialiserMdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialiserMdpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialiserMdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
