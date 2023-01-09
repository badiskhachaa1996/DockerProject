import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireSatisfactionComponent } from './questionnaire-satisfaction.component';

describe('QuestionnaireSatisfactionComponent', () => {
  let component: QuestionnaireSatisfactionComponent;
  let fixture: ComponentFixture<QuestionnaireSatisfactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireSatisfactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireSatisfactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
