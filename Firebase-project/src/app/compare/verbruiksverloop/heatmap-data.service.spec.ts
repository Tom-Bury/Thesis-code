import { TestBed } from '@angular/core/testing';

import { HeatmapDataService } from './heatmap-data.service';

describe('HeatmapDataService', () => {
  let service: HeatmapDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatmapDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
