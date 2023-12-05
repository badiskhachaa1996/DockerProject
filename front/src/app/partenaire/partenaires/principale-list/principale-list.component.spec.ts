import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipaleListComponent } from './principale-list.component';

describe('PrincipaleListComponent', () => {
  let component: PrincipaleListComponent;
  let fixture: ComponentFixture<PrincipaleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipaleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
