import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivagePointageComponent } from './archivage-pointage.component';

describe('ArchivagePointageComponent', () => {
  let component: ArchivagePointageComponent;
  let fixture: ComponentFixture<ArchivagePointageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivagePointageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivagePointageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
