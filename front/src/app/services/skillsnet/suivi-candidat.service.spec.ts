import { TestBed } from '@angular/core/testing';

import { SuiviCandidatService } from './suivi-candidat.service';

describe('SuiviCandidatService', () => {
  let service: SuiviCandidatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiviCandidatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
