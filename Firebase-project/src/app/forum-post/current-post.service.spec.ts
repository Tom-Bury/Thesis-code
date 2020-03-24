import { TestBed } from '@angular/core/testing';

import { CurrentPostService } from './current-post.service';

describe('CurrentPostService', () => {
  let service: CurrentPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
