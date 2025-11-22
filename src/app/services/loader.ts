import { Injectable } from '@angular/core';
import { ClienteService } from './cliente-service';
import { ServicosService } from './servicos-service';
import { FuncionariasService } from './funcionarias-service';
import { AgendamentoService } from './agendamento-service';
import { MetodoPagamentoService } from './metodo-pagamento-service';
import { TransacoesService } from './transacoes-service';
@Injectable({
  providedIn: 'root',
})
export class Loader {
  constructor(
    private clienteService: ClienteService,
    private servicosService: ServicosService,
    private funcionariasService: FuncionariasService,
    private agendamentoService: AgendamentoService,
    private metodosPagamentoService: MetodoPagamentoService,
    private transacoesService: TransacoesService
  ) {}

  carregarDados(): void {
    this.clienteService.listaClientes$.subscribe((clientes) => {
      if (clientes.length === 0) {
        this.clienteService.carregarClientes().subscribe();
      }
    });
    this.servicosService.listaServicos$.subscribe((servicos) => {
      if (servicos.length === 0) {
        this.servicosService.carregarServicos().subscribe();
      }
    });
    this.funcionariasService.listaFuncionarias$.subscribe((funcionarias) => {
      if (funcionarias.length === 0) {
        this.funcionariasService.carregarFuncionarias().subscribe();
      }
    });
    this.agendamentoService.listaAgendamentos$.subscribe((agendamentos) => {
      if (agendamentos.length === 0) {
        this.agendamentoService.getAgendamentos().subscribe();
      }
    });
    this.metodosPagamentoService.listaMetodosPagamentos$.subscribe((metodos) => {
      if (metodos.length === 0) {
        this.metodosPagamentoService.carregarMetodosPagamento().subscribe();
      }
    });
    this.transacoesService.listaTransacoes$.subscribe((transacoes) => {
      if (transacoes.length === 0) {
        this.transacoesService.carregarTransacoes();
      }
    });
  }
}
