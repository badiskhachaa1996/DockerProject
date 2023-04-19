import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsIntComponent } from './teams-int.component';

describe('TeamsIntComponent', () => {
  let component: TeamsIntComponent;
  let fixture: ComponentFixture<TeamsIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
