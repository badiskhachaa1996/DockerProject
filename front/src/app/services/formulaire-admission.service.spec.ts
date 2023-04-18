import { TestBed } from '@angular/core/testing';

import { FormulaireAdmissionService } from './formulaire-admission.service';

describe('FormulaireAdmissionService', () => {
  let service: FormulaireAdmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulaireAdmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
