import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenDocLettreAcceptationComponent } from './gen-doc-lettre-acceptation.component';

describe('GenDocLettreAcceptationComponent', () => {
  let component: GenDocLettreAcceptationComponent;
  let fixture: ComponentFixture<GenDocLettreAcceptationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenDocLettreAcceptationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenDocLettreAcceptationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
