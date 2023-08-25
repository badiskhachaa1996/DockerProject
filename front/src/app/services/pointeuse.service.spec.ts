import { TestBed } from '@angular/core/testing';

import { PointeuseService } from './pointeuse.service';

describe('PointeuseService', () => {
  let service: PointeuseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointeuseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
