import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExterneSkillsnetComponent } from './externe-skillsnet.component';

describe('ExterneSkillsnetComponent', () => {
  let component: ExterneSkillsnetComponent;
  let fixture: ComponentFixture<ExterneSkillsnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExterneSkillsnetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExterneSkillsnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
