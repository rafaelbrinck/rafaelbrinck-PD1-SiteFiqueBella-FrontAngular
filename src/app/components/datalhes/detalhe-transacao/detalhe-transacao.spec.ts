import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheTransacao } from './detalhe-transacao';

describe('DetalheTransacao', () => {
  let component: DetalheTransacao;
  let fixture: ComponentFixture<DetalheTransacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheTransacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheTransacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
