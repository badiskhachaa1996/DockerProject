import { TestBed } from '@angular/core/testing';

import { FormulaireIcbsService } from './formulaire-icbs.service';

describe('FormulaireIcbsService', () => {
  let service: FormulaireIcbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulaireIcbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
