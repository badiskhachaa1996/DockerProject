import { TestBed } from '@angular/core/testing';

import { ForfeitFormService } from './forfeit-form.service';

describe('ForfeitFormService', () => {
  let service: ForfeitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForfeitFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
