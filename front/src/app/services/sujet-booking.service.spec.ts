import { TestBed } from '@angular/core/testing';

import { SujetBookingService } from './sujet-booking.service';

describe('SujetBookingService', () => {
  let service: SujetBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SujetBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
