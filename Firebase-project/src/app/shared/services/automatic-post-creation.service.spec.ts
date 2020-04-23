import { TestBed } from '@angular/core/testing';

import { AutomaticPostCreationService } from './automatic-post-creation.service';

describe('AutomaticPostCreationService', () => {
  let service: AutomaticPostCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomaticPostCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
