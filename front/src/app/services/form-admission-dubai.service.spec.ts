import { TestBed } from '@angular/core/testing';

import { FormAdmissionDubaiService } from './form-admission-dubai.service';

describe('FormAdmissionDubaiService', () => {
  let service: FormAdmissionDubaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormAdmissionDubaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
