import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivretGeneratorComponent } from './livret-generator.component';

describe('LivretGeneratorComponent', () => {
  let component: LivretGeneratorComponent;
  let fixture: ComponentFixture<LivretGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivretGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivretGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
