import { TestBed } from '@angular/core/testing';

import { HistoriqueEchangeService } from './historique-echange.service';

describe('HistoriqueEchangeService', () => {
  let service: HistoriqueEchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueEchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
