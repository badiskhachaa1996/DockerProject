import { TestBed } from '@angular/core/testing';

import { GenDocService } from './gendoc.service';

describe('GenDocService', () => {
  let service: GenDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
