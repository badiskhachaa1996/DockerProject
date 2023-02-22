import { TestBed } from '@angular/core/testing';

import { ExterneSNService } from './externe-sn.service';

describe('ExterneSNService', () => {
  let service: ExterneSNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExterneSNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
