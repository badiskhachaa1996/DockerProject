import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMatchComponent } from './i-match.component';

describe('IMatchComponent', () => {
  let component: IMatchComponent;
  let fixture: ComponentFixture<IMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
