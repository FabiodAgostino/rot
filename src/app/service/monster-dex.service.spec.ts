import { TestBed } from '@angular/core/testing';

import { MonsterDexService } from './monster-dex.service';

describe('MonsterDexService', () => {
  let service: MonsterDexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonsterDexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
