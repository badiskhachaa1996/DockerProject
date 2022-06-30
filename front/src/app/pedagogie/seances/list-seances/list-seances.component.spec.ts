import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSeancesComponent } from './list-seances.component';

describe('ListSeancesComponent', () => {
  let component: ListSeancesComponent;
  let fixture: ComponentFixture<ListSeancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSeancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSeancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
