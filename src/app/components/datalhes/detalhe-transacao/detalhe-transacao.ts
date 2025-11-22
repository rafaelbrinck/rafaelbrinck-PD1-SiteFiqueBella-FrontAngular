import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importe os Models necessários
import { Transacao } from '../../../models/Transacao';
import { Cliente } from '../../../models/cliente';
import { Servico } from '../../../models/servicos';
import { MetodoPagamento } from '../../../models/MetodoPagamento';
import { Funcionaria } from '../../../models/funcionarias';

@Component({
  selector: 'app-detalhe-transacao',
  standalone: true,
  imports: [CommonModule], // Necessário para os Pipes de data e moeda no HTML
  templateUrl: './detalhe-transacao.html',
  styleUrl: './detalhe-transacao.css',
})
export class DetalheTransacao {
  // --- DADO PRINCIPAL ---
  @Input() transacao: Transacao | null = null;

  // --- LISTAS PARA CONSULTA (LOOKUP) ---
  // O componente pai vai passar as listas completas para cá
  @Input() listaClientes: Cliente[] = [];
  @Input() listaServicos: Servico[] = [];
  @Input() listaMetodosPagamento: MetodoPagamento[] = [];
  @Input() listaFuncionarias: Funcionaria[] = [];

  // --- EVENTOS DE SAÍDA ---
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  constructor() {}

  onClose() {
    this.close.emit();
  }

  onDelete() {
    if (confirm('ATENÇÃO: Deseja excluir este registro financeiro do histórico?')) {
      this.delete.emit();
    }
  }

  // --- MÉTODOS DE BUSCA (GETTERS) ---
  // Estes métodos usam o ID que está na transação para achar o nome na lista

  getClienteNome(): string {
    if (!this.transacao?.cliente_id) return '---';
    const cliente = this.listaClientes.find(
      (c) => String(c.cliente_id) == String(this.transacao!.cliente_id)
    );
    return cliente ? `${cliente.nome}` : 'Cliente não identificado';
  }

  getServicoNome(): string {
    if (!this.transacao?.agendamento_id) return '---';
    const servico = this.listaServicos.find(
      (s) => String(s.servico_id) == String(this.transacao?.agendamento_id)
    );
    return servico ? servico.nome! : 'Serviço não identificado';
  }

  getFuncionariaNome(): string {
    const func = this.listaFuncionarias.find(
      (f) => String(f.funcionario_id) == String(this.transacao?.agendamento_id)
    );
    return func ? `${func.nome} ${func.sobrenome}` : '---';
  }

  getMetodoPagamentoNome(): string {
    if (!this.transacao?.metodo_pagamento_id) return '---';
    const metodo = this.listaMetodosPagamento.find(
      (m) => String(m.metodo_pagamento_id) == String(this.transacao!.metodo_pagamento_id)
    );
    return metodo ? metodo.nome : 'Método Desconhecido';
  }

  getIconeMetodo(): string {
    const nome = this.getMetodoPagamentoNome().toLowerCase();
    if (nome.includes('pix')) return 'bi-qr-code';
    if (nome.includes('cartão') || nome.includes('crédito') || nome.includes('débito'))
      return 'bi-credit-card';
    if (nome.includes('dinheiro')) return 'bi-cash';
    return 'bi-cash-coin';
  }
}
