import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartenaireComponent } from './list-partenaire.component';

describe('ListPartenaireComponent', () => {
  let component: ListPartenaireComponent;
  let fixture: ComponentFixture<ListPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPartenaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
