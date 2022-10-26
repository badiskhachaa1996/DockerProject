import { TestBed } from '@angular/core/testing';

import { TeamCommercialService } from './team-commercial.service';

describe('TeamCommercialService', () => {
  let service: TeamCommercialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamCommercialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
