import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntrepriseCeoComponent } from './list-entreprise-ceo.component';

describe('ListEntrepriseCeoComponent', () => {
  let component: ListEntrepriseCeoComponent;
  let fixture: ComponentFixture<ListEntrepriseCeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEntrepriseCeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEntrepriseCeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
