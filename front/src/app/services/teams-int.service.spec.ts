import { TestBed } from '@angular/core/testing';

import { TeamsIntService } from './teams-int.service';

describe('TeamsIntService', () => {
  let service: TeamsIntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsIntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
