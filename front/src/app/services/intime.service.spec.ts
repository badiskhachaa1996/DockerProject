import { TestBed } from '@angular/core/testing';

import { IntimeService } from './intime.service';

describe('IntimeService', () => {
  let service: IntimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
