import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDiplomeComponent } from './list-diplome.component';

describe('ListDiplomeComponent', () => {
  let component: ListDiplomeComponent;
  let fixture: ComponentFixture<ListDiplomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDiplomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDiplomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
