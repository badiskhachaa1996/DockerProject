import { TestBed } from '@angular/core/testing';

import { FirstInscriptionService } from './first-inscription.service';

describe('FirstInscriptionService', () => {
  let service: FirstInscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstInscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
