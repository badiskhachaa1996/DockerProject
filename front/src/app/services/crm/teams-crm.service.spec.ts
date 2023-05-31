import { TestBed } from '@angular/core/testing';

import { TeamsCrmService } from './teams-crm.service';

describe('TeamsCrmService', () => {
  let service: TeamsCrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsCrmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
