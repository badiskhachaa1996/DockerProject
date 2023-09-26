import { TestBed } from '@angular/core/testing';

import { CalendrierEtudiantService } from './calendrier-etudiant.service';

describe('CalendrierEtudiantService', () => {
  let service: CalendrierEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendrierEtudiantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
