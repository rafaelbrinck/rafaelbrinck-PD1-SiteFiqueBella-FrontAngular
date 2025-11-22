import { TestBed } from '@angular/core/testing';

import { MetodoPagamentoService } from './metodo-pagamento-service';

describe('MetodoPagamentoService', () => {
  let service: MetodoPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetodoPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
