import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireFormateurComponent } from './questionnaire-formateur.component';

describe('QuestionnaireFormateurComponent', () => {
  let component: QuestionnaireFormateurComponent;
  let fixture: ComponentFixture<QuestionnaireFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireFormateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
