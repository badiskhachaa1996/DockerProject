import { TestBed } from '@angular/core/testing';

import { CalendrierRhService } from './calendrier-rh.service';

describe('CalendrierRhService', () => {
  let service: CalendrierRhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendrierRhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
