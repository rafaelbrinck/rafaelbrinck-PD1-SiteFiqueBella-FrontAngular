import { TestBed } from '@angular/core/testing';

import { FuncionariasService } from './funcionarias-service';

describe('FuncionariasService', () => {
  let service: FuncionariasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionariasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
