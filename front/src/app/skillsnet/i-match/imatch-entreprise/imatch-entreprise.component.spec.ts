import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImatchEntrepriseComponent } from './imatch-entreprise.component';

describe('ImatchEntrepriseComponent', () => {
  let component: ImatchEntrepriseComponent;
  let fixture: ComponentFixture<ImatchEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImatchEntrepriseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImatchEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
