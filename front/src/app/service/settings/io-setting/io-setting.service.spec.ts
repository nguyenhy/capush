import { TestBed } from '@angular/core/testing';

import { IOSettingService } from './io-setting.service';

describe('IOSettingService', () => {
  let service: IOSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IOSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
