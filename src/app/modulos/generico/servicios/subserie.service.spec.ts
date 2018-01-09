import { TestBed, inject } from '@angular/core/testing';

import { SubserieService } from './subserie.service';

describe('SubserieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubserieService]
    });
  });

  it('should be created', inject([SubserieService], (service: SubserieService) => {
    expect(service).toBeTruthy();
  }));
});
