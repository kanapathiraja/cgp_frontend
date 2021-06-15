import { TestBed } from '@angular/core/testing';

import { CgpService } from './cgp.service';

describe('CgpService', () => {
  let service: CgpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CgpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
