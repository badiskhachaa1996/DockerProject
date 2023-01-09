import { TestBed } from '@angular/core/testing';

import { QSService } from './qs.service';

describe('QSService', () => {
  let service: QSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
