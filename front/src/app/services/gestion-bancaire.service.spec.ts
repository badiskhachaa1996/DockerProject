import { TestBed } from '@angular/core/testing';

import { GestionBancaireService } from './gestion-bancaire.service';

describe('GestionBancaireService', () => {
  let service: GestionBancaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionBancaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
