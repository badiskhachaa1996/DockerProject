import { TestBed } from '@angular/core/testing';

import { AlternantsPartenaireService } from './alternants-partenaire.service';

describe('AlternantsPartenaireService', () => {
  let service: AlternantsPartenaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlternantsPartenaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
