import { TestBed } from '@angular/core/testing';

import { AlternantService } from './alternant.service';

describe('AlternantService', () => {
  let service: AlternantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlternantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
