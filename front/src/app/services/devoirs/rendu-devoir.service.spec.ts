import { TestBed } from '@angular/core/testing';

import { RenduDevoirService } from './rendu-devoir.service';

describe('RenduDevoirService', () => {
  let service: RenduDevoirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenduDevoirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
