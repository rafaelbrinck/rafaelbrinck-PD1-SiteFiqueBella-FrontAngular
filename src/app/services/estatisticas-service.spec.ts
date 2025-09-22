import { TestBed } from '@angular/core/testing';

import { EstatisticasService } from './estatisticas-service';

describe('EstatisticasService', () => {
  let service: EstatisticasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstatisticasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
