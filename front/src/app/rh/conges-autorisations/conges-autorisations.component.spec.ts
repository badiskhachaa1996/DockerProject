import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongesAutorisationsComponent } from './conges-autorisations.component';

describe('CongesAutorisationsComponent', () => {
  let component: CongesAutorisationsComponent;
  let fixture: ComponentFixture<CongesAutorisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongesAutorisationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongesAutorisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
