import { TestBed } from '@angular/core/testing';

import { EtudiantsIntunsService } from './etudiants-intuns.service';

describe('EtudiantsIntunsService', () => {
  let service: EtudiantsIntunsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtudiantsIntunsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
