import { TestBed } from '@angular/core/testing';

import { FactureCommissionService } from './facture-commission.service';

describe('FactureCommissionService', () => {
  let service: FactureCommissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureCommissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
