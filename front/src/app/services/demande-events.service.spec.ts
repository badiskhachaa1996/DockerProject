import { TestBed } from '@angular/core/testing';

import { DemandeEventsService } from './demande-events.service';

describe('DemandeEventsService', () => {
  let service: DemandeEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
