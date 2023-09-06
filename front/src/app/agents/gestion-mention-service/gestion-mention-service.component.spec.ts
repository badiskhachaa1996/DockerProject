import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMentionServiceComponent } from './gestion-mention-service.component';

describe('GestionMentionServiceComponent', () => {
  let component: GestionMentionServiceComponent;
  let fixture: ComponentFixture<GestionMentionServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionMentionServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMentionServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
