import { TestBed } from '@angular/core/testing';

import { DailyCheckService } from './daily-check.service';

describe('DailyCheckService', () => {
  let service: DailyCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
