import { TestBed } from '@angular/core/testing';

import { PreviousLoadedPostsService } from './previous-loaded-posts.service';

describe('PreviousLoadedPostsService', () => {
  let service: PreviousLoadedPostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousLoadedPostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
