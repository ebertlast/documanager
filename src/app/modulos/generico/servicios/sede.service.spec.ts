import { TestBed, inject } from '@angular/core/testing';

import { SedeService } from './sede.service';

describe('SedeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SedeService]
    });
  });

  it('should be created', inject([SedeService], (service: SedeService) => {
    expect(service).toBeTruthy();
  }));
});
