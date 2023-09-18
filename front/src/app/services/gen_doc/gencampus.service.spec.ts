import { TestBed } from '@angular/core/testing';

import { GenCampusService } from './gencampus.service';

describe('GenCampusService', () => {
  let service: GenCampusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenCampusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
