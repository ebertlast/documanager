import { TestBed, inject } from '@angular/core/testing';

import { TipoService } from './tipo.service';

describe('TipoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoService]
    });
  });

  it('should be created', inject([TipoService], (service: TipoService) => {
    expect(service).toBeTruthy();
  }));
});
