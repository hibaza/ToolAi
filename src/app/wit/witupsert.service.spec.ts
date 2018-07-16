import { TestBed, inject } from '@angular/core/testing';

import { WitupsertService } from './witupsert.service';

describe('WitupsertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WitupsertService]
    });
  });

  it('should be created', inject([WitupsertService], (service: WitupsertService) => {
    expect(service).toBeTruthy();
  }));
});
