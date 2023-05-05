import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationDocComponent } from './generation-doc.component';

describe('GenerationDocComponent', () => {
  let component: GenerationDocComponent;
  let fixture: ComponentFixture<GenerationDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerationDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerationDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
