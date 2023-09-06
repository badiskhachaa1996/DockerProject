import { TestBed } from '@angular/core/testing';

import { MeetingTeamsService } from './meeting-teams.service';

describe('MeetingTeamsService', () => {
  let service: MeetingTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
