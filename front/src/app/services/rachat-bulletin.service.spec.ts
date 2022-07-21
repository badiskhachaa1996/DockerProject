import { TestBed } from '@angular/core/testing';

import { RachatBulletinService } from './rachat-bulletin.service';

describe('RachatBulletinService', () => {
  let service: RachatBulletinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RachatBulletinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
