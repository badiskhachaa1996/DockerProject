import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuivreLeadComponent } from './suivre-lead.component';

describe('SuivreLeadComponent', () => {
  let component: SuivreLeadComponent;
  let fixture: ComponentFixture<SuivreLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuivreLeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuivreLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
