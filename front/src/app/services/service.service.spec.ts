import { TestBed } from '@angular/core/testing';

import { ServService } from './service.service';

describe('ServiceService', () => {
  let service: ServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
