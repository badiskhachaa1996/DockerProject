import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireFinFormationComponent } from './questionnaire-fin-formation.component';

describe('QuestionnaireFinFormationComponent', () => {
  let component: QuestionnaireFinFormationComponent;
  let fixture: ComponentFixture<QuestionnaireFinFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireFinFormationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireFinFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
