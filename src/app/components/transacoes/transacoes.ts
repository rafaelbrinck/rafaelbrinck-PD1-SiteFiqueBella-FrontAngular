import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Transacao } from '../../models/Transacao';
import { Cliente } from '../../models/cliente';
import { MetodoPagamento } from '../../models/MetodoPagamento';
import { FuncionariasService } from '../../services/funcionarias-service';
import { ServicosService } from '../../services/servicos-service';
import { TransacoesService } from '../../services/transacoes-service';
import { ClienteService } from '../../services/cliente-service';
import { MetodoPagamentoService } from '../../services/metodo-pagamento-service';
import { DetalheTransacao } from '../datalhes/detalhe-transacao/detalhe-transacao';
import { Servico } from '../../models/servicos';
import { Funcionaria } from '../../models/funcionarias';
@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, DetalheTransacao],
  templateUrl: './transacoes.html',
  styleUrl: './transacoes.css',
})
export class Transacoes implements OnInit, OnDestroy {
  // Listas de dados
  listaServicos: Servico[] = [];
  listaTransacoes: Transacao[] = [];
  listaClientes: Cliente[] = [];
  listaFuncionarias: Funcionaria[] = [];
  listaMetodosPagamento: MetodoPagamento[] = [];
  private destroy$ = new Subject<void>();

  isModalVisible = false;
  transacaoSelecionada: Transacao | null = null;

  constructor(
    private transacaoService: TransacoesService,
    private clienteService: ClienteService,
    private metodoPagamentoService: MetodoPagamentoService,
    private servicosService: ServicosService,
    private funcionariasService: FuncionariasService
  ) {}

  ngOnInit(): void {
    // 1. Busca as Transações
    this.transacaoService.listaTransacoes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transacoes) => {
        this.listaTransacoes = transacoes;

        // Se a lista estiver vazia, força uma busca na API (igual fizemos no calendário)
        if (this.listaTransacoes.length === 0) {
          this.transacaoService.carregarTransacoes();
        }
      });

    // 2. Busca Clientes (para podermos mostrar o NOME em vez do ID)
    this.clienteService.listaClientes$.pipe(takeUntil(this.destroy$)).subscribe((clientes) => {
      this.listaClientes = clientes;
    });

    // 3. Busca Métodos de Pagamento (para mostrar o NOME em vez do ID)
    this.metodoPagamentoService.listaMetodosPagamentos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((metodos) => {
        this.listaMetodosPagamento = metodos;
      });

    // 4. Busca Serviços (para mostrar o NOME em vez do ID)
    this.servicosService.listaServicos$.pipe(takeUntil(this.destroy$)).subscribe((servicos) => {
      this.listaServicos = servicos;
    });

    this.funcionariasService.listaFuncionarias$
      .pipe(takeUntil(this.destroy$))
      .subscribe((funcionarias) => {
        this.listaFuncionarias = funcionarias;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  abrirModalDetalhes(transacao: Transacao) {
    this.transacaoSelecionada = transacao;
    this.isModalVisible = true;
  }

  fecharModal() {
    this.isModalVisible = false;
    this.transacaoSelecionada = null;
  }

  // --- MÉTODOS AUXILIARES PARA O HTML ---

  /**
   * Recebe um ID de cliente e retorna o Nome completo.
   * Usado no HTML para não mostrar o UUID.
   */
  getClienteNome(clienteId: string): string {
    // A comparação '==' permite comparar string com number se necessário, por segurança
    const cliente = this.listaClientes.find(
      (c) => c.cliente_id == clienteId || String(c.cliente_id) == clienteId
    );
    return cliente ? `${cliente.nome}` : 'Cliente não identificado';
  }

  /**
   * Recebe um ID de método e retorna o Nome (ex: "Pix", "Dinheiro").
   */
  getMetodoPagamentoNome(metodoId: string): string {
    const metodo = this.listaMetodosPagamento.find(
      (m) => m.metodo_pagamento_id == metodoId || String(m.metodo_pagamento_id) == metodoId
    );
    return metodo ? metodo.nome : 'Desconhecido';
  }
}
