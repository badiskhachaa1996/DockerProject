import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormateursComponent } from './list-formateurs.component';

describe('ListFormateursComponent', () => {
  let component: ListFormateursComponent;
  let fixture: ComponentFixture<ListFormateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFormateursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
