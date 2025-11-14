import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheAgendamento } from './detalhe-agendamento';

describe('DetalheAgendamento', () => {
  let component: DetalheAgendamento;
  let fixture: ComponentFixture<DetalheAgendamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheAgendamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheAgendamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
