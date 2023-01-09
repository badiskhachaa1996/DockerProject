import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressionPedagogiqueComponent } from './progression-pedagogique.component';

describe('ProgressionPedagogiqueComponent', () => {
  let component: ProgressionPedagogiqueComponent;
  let fixture: ComponentFixture<ProgressionPedagogiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressionPedagogiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressionPedagogiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
