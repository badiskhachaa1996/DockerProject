import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenOutroComponent } from './gen-outro.component';

describe('GenOutroComponent', () => {
  let component: GenOutroComponent;
  let fixture: ComponentFixture<GenOutroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenOutroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenOutroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
