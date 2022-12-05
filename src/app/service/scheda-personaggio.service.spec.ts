import { TestBed } from '@angular/core/testing';

import { SchedaPersonaggioService } from './scheda-personaggio.service';

describe('SchedaPersonaggioService', () => {
  let service: SchedaPersonaggioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedaPersonaggioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
