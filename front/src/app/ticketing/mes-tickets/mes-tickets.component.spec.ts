import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesTicketsComponent } from './mes-tickets.component';

describe('MesTicketsComponent', () => {
  let component: MesTicketsComponent;
  let fixture: ComponentFixture<MesTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
