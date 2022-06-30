import { TestBed } from '@angular/core/testing';

import { EtatPreinscriptionServiceService } from './etat-preinscription-service.service';

describe('EtatPreinscriptionServiceService', () => {
  let service: EtatPreinscriptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtatPreinscriptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
