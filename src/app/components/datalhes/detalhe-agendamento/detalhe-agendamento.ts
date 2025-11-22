import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Agendamento, AgendamentoDB } from '../../../models/Agendamento';
import { Cliente } from '../../../models/cliente';
import { Servico } from '../../../models/servicos';
import { Funcionaria } from '../../../models/funcionarias';
import { CommonModule } from '@angular/common';
import { StatusEnum } from '../../../models/Agendamento';
import { MetodoPagamentoService } from '../../../services/metodo-pagamento-service';
import { MetodoPagamento } from '../../../models/MetodoPagamento';
import { AgendamentoService } from '../../../services/agendamento-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalhe-agendamento',
  imports: [CommonModule],
  templateUrl: './detalhe-agendamento.html', // Certifique-se que o nome do arquivo está correto
  styleUrl: './detalhe-agendamento.css',
})
export class DetalheAgendamento {
  // --- DADOS RECEBIDOS DO PAI (CalendarioComponent) ---
  @Input() agendamento: Agendamento | null = null;
  @Input() cliente: Cliente | null = null;
  @Input() servico: Servico | null = null;
  @Input() funcionaria: Funcionaria | null = null;
  @Input() apenasVisualizar: boolean = false;

  // --- EVENTOS DE AÇÃO ENVIADOS PARA O PAI ---
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  // Atualizamos o evento 'complete' para enviar o método de pagamento escolhido
  @Output() complete = new EventEmitter<MetodoPagamento>();

  listaMetodosPagamento: MetodoPagamento[] = [];

  // --- VARIÁVEIS DE CONTROLE DA INTERFACE ---
  showPaymentView: boolean = false; // Controla se mostra detalhes ou pagamento
  metodoSelecionado: MetodoPagamento | null = null;

  constructor(
    private metodoPagamentoService: MetodoPagamentoService,
    private agendamentoService: AgendamentoService
  ) {
    this.metodoPagamentoService.listaMetodosPagamentos$.subscribe((metodos) => {
      this.listaMetodosPagamento = metodos;
    });
  }

  // --- MÉTODOS DE AÇÃO BÁSICOS ---
  onCancel() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      const valida = this.agendamentoService.updateStatus(
        this.agendamento?.id!,
        StatusEnum.CANCELADO,
        '',
        0
      );
      if (valida) {
        this.close.emit();
      }
    }
  }

  // --- LÓGICA DO FLUXO DE PAGAMENTO ---

  // 1. Chamado pelo botão "Finalizar" na tela de detalhes
  iniciarPagamento() {
    this.showPaymentView = true;
    this.metodoSelecionado = null; // Reseta seleção anterior
  }

  // 2. Chamado pelo botão "Voltar" na tela de pagamento
  cancelarPagamento() {
    this.showPaymentView = false;
  }

  // 3. Chamado ao clicar em um card de pagamento
  selecionarMetodo(metodo: MetodoPagamento) {
    this.metodoSelecionado = metodo;
  }

  // 4. Chamado pelo botão "Confirmar Recebimento"
  confirmarPagamento() {
    if (this.metodoSelecionado) {
      if (confirm(`Confirmar pagamento via ${this.metodoSelecionado.nome}?`)) {
        const valida = this.agendamentoService.updateStatus(
          this.agendamento?.id!,
          StatusEnum.CONCLUIDO,
          this.metodoSelecionado.metodo_pagamento_id,
          this.servico?.preco!
        );
        if (valida) {
          this.close.emit();
        }
      }
    }
  }

  // --- AUXILIARES ---,0,
  getClasseDeStatus(status: StatusEnum | undefined): string {
    if (!status) return 'text-gray-500';

    switch (status) {
      case StatusEnum.AGENDADO:
        return 'text-yellow-700';
      case StatusEnum.CONCLUIDO:
        return 'text-green-600';
      case StatusEnum.CANCELADO:
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  }

  validaBotoes(): boolean {
    if (
      this.agendamento!.status !== StatusEnum.CONCLUIDO &&
      this.agendamento!.status !== StatusEnum.CANCELADO
    ) {
      return true;
    }
    return false;
  }
}
