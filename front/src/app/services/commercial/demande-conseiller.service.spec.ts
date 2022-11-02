import { TestBed } from '@angular/core/testing';

import { DemandeConseillerService } from './demande-conseiller.service';

describe('DemandeConseillerService', () => {
  let service: DemandeConseillerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeConseillerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
