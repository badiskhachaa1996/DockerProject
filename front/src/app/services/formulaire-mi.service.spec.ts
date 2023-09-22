import { TestBed } from '@angular/core/testing';

import { FormulaireMIService } from './formulaire-mi.service';

describe('FormulaireMIService', () => {
  let service: FormulaireMIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulaireMIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
