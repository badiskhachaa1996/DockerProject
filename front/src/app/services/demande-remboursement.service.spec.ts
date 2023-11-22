import { TestBed } from '@angular/core/testing';

import { DemandeRemboursementService } from './demande-remboursement.service';

describe('DemandeRemboursementService', () => {
  let service: DemandeRemboursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeRemboursementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
