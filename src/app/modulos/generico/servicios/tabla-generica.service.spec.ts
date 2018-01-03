import { TestBed, inject } from '@angular/core/testing';

import { TablaGenericaService } from './tabla-generica.service';

describe('TablaGenericaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TablaGenericaService]
    });
  });

  it('should be created', inject([TablaGenericaService], (service: TablaGenericaService) => {
    expect(service).toBeTruthy();
  }));
});
