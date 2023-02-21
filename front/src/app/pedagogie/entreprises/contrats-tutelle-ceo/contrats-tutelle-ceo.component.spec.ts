import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratsTutelleCeoComponent } from './contrats-tutelle-ceo.component';

describe('ContratsTutelleCeoComponent', () => {
  let component: ContratsTutelleCeoComponent;
  let fixture: ComponentFixture<ContratsTutelleCeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratsTutelleCeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratsTutelleCeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
