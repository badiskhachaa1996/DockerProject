import { TestBed } from '@angular/core/testing';

import { GenRentreService } from './genrentre.service';

describe('GenRentreService', () => {
  let service: GenRentreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenRentreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
