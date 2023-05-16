import { TestBed } from '@angular/core/testing';

import { GenDocIntService } from './gen-doc-int.service';

describe('GenDocIntService', () => {
  let service: GenDocIntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenDocIntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
