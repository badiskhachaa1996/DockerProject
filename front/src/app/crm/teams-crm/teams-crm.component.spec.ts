import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsCrmComponent } from './teams-crm.component';

describe('TeamsCrmComponent', () => {
  let component: TeamsCrmComponent;
  let fixture: ComponentFixture<TeamsCrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsCrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
