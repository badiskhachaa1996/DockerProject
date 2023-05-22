import { TestBed } from '@angular/core/testing';

import { ActiviteIntService } from './activite-int.service';

describe('ActiviteIntService', () => {
  let service: ActiviteIntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiviteIntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
