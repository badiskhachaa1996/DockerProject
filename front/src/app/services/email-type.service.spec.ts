import { TestBed } from '@angular/core/testing';

import { EmailTypeService } from './email-type.service';

describe('EmailTypeService', () => {
  let service: EmailTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
