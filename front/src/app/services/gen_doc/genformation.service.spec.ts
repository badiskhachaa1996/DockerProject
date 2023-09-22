import { TestBed } from '@angular/core/testing';

import { GenFormationService } from './genformation.service';

describe('GenFormationService', () => {
  let service: GenFormationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenFormationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
