import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemboussementComponent } from './add-remboussement.component';

describe('AddRemboussementComponent', () => {
  let component: AddRemboussementComponent;
  let fixture: ComponentFixture<AddRemboussementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemboussementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemboussementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
