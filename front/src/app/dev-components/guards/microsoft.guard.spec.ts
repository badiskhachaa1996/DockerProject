import { TestBed } from '@angular/core/testing';

import { MicrosoftGuard } from './microsoft.guard';

describe('MicrosoftGuard', () => {
  let guard: MicrosoftGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MicrosoftGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
