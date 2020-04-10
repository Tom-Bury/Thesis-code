import { TestBed } from '@angular/core/testing';

import { KwhCalculatorService } from './kwh-calculator.service';

describe('KwhCalculatorService', () => {
  let service: KwhCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KwhCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
