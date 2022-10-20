import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreprisesMissionsComponent } from './entreprises-missions.component';

describe('EntreprisesMissionsComponent', () => {
  let component: EntreprisesMissionsComponent;
  let fixture: ComponentFixture<EntreprisesMissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreprisesMissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntreprisesMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
