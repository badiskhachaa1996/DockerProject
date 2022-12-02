import { TestBed } from '@angular/core/testing';

import { DevoirsService } from './devoirs.service';

describe('DevoirsService', () => {
  let service: DevoirsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevoirsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
