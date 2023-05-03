import { TestBed } from '@angular/core/testing';

import { SupportMarketingService } from './support-marketing.service';

describe('SupportMarketingService', () => {
  let service: SupportMarketingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportMarketingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
