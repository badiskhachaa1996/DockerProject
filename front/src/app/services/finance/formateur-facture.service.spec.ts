import { TestBed } from '@angular/core/testing';

import { FormateurFactureService } from './formateur-facture.service';

describe('FormateurFactureService', () => {
  let service: FormateurFactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormateurFactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
