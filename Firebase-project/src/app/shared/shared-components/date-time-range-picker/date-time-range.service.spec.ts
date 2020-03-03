import { TestBed } from '@angular/core/testing';

import { DateTimeRangeService } from './date-time-range.service';

describe('DateTimeRangeService', () => {
  let service: DateTimeRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
