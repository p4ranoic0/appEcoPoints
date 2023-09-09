import { TestBed } from '@angular/core/testing';

import { CanjearService } from './canjear.service';

describe('CanjearService', () => {
  let service: CanjearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanjearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
