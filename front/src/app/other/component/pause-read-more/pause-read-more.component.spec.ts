import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseReadMoreComponent } from './pause-read-more.component';

describe('PauseReadMoreComponent', () => {
  let component: PauseReadMoreComponent;
  let fixture: ComponentFixture<PauseReadMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PauseReadMoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PauseReadMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
