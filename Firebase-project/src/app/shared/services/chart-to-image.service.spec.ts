import { TestBed } from '@angular/core/testing';

import { ChartToImageService } from './chart-to-image.service';

describe('ChartToImageService', () => {
  let service: ChartToImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartToImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
