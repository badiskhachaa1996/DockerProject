import { TestBed } from '@angular/core/testing';
import { TeamsCRM } from 'src/app/models/TeamsCRM';
import { environment } from 'src/environments/environment';

import { CriteresCrmService } from './criteres-crm.service';

describe('CriteresCrmService', () => {
  let service: CriteresCrmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteresCrmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
