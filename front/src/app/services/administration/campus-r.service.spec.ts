import { TestBed } from '@angular/core/testing';

import { CampusRService } from './campus-r.service';

describe('CampusRService', () => {
  let service: CampusRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
