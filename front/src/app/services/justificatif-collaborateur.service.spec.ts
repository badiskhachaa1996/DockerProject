import { TestBed } from '@angular/core/testing';

import { JustificatifCollaborateurService } from './justificatif-collaborateur.service';

describe('JustificatifCollaborateurService', () => {
  let service: JustificatifCollaborateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificatifCollaborateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
