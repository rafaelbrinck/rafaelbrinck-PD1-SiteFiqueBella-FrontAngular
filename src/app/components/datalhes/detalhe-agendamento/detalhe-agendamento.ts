import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Agendamento } from '../../../models/Agendamento';
import { Cliente } from '../../../models/cliente';
import { Servico } from '../../../models/servicos';
import { Funcionaria } from '../../../models/funcionarias';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhe-agendamento',
  imports: [CommonModule],
  templateUrl: './detalhe-agendamento.html',
  styleUrl: './detalhe-agendamento.css',
})
export class DetalheAgendamento {
  // --- DADOS RECEBIDOS DO PAI (CalendarioComponent) ---
  @Input() agendamento: Agendamento | null = null;
  @Input() cliente: Cliente | null = null;
  @Input() servico: Servico | null = null;
  @Input() funcionaria: Funcionaria | null = null;

  // --- EVENTOS DE AÇÃO ENVIADOS PARA O PAI ---
  @Output() close = new EventEmitter<void>(); // "Cancelar" ou "X"
  @Output() edit = new EventEmitter<void>(); // "Atualizar" (pedir para abrir o form de edição)
  @Output() delete = new EventEmitter<void>(); // "Excluir"
  @Output() complete = new EventEmitter<void>(); // "Finalizar Agendamento"

  constructor() {}

  // Métodos que apenas emitem os eventos
  onCancel() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDelete() {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      this.delete.emit();
    }
  }

  onComplete() {
    // Adicione uma confirmação para uma ação importante
    if (confirm('Tem certeza que deseja marcar este agendamento como finalizado?')) {
      this.complete.emit();
    }
  }
}
