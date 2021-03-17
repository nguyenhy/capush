import { TestBed } from '@angular/core/testing';

import { InputConfigService } from './input-config.service';

describe('InputConfigService', () => {
  let service: InputConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
