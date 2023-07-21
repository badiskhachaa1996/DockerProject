import { TestBed } from '@angular/core/testing';

import { CandidatureLeadService } from './candidature-lead.service';

describe('CandidatureLeadService', () => {
  let service: CandidatureLeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatureLeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
