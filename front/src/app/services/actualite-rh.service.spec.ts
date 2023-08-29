import { TestBed } from '@angular/core/testing';

import { ActualiteRHService } from './actualite-rh.service';

describe('ActualiteRHService', () => {
  let service: ActualiteRHService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualiteRHService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
