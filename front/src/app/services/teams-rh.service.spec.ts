import { TestBed } from '@angular/core/testing';

import { TeamsRHService } from './teams-rh.service';

describe('TeamsRHService', () => {
  let service: TeamsRHService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsRHService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
