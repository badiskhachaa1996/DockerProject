import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesLeadsComponent } from './mes-leads.component';

describe('MesLeadsComponent', () => {
  let component: MesLeadsComponent;
  let fixture: ComponentFixture<MesLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesLeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
