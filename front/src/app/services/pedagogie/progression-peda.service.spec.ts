import { TestBed } from '@angular/core/testing';

import { ProgressionPedaService } from './progression-peda.service';

describe('ProgressionPedaService', () => {
  let service: ProgressionPedaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressionPedaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
