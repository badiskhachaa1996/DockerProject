import { TestBed } from '@angular/core/testing';

import { CommercialPartenaireService } from './commercial-partenaire.service';

describe('CommercialPartenaireService', () => {
  let service: CommercialPartenaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommercialPartenaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
