import { TestBed, inject } from '@angular/core/testing';

import { DisposicionService } from './disposicion.service';

describe('DisposicionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisposicionService]
    });
  });

  it('should be created', inject([DisposicionService], (service: DisposicionService) => {
    expect(service).toBeTruthy();
  }));
});
