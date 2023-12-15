import { TestBed } from '@angular/core/testing';

import { AutoTicketService } from './auto-ticket.service';

describe('AutoTicketService', () => {
  let service: AutoTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
