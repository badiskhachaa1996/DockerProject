import { TestBed } from '@angular/core/testing';

import { LeadcrmService } from './leadcrm.service';

describe('LeadcrmService', () => {
  let service: LeadcrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadcrmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
