import { TestBed } from '@angular/core/testing';

import { GenSchoolService } from './genschool.service';

describe('GenSchoolService', () => {
  let service: GenSchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenSchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
