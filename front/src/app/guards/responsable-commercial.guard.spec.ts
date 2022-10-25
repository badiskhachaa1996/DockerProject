import { TestBed } from '@angular/core/testing';

import { ResponsableCommercialGuard } from './responsable-commercial.guard';

describe('ResponsableCommercialGuard', () => {
  let guard: ResponsableCommercialGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResponsableCommercialGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
