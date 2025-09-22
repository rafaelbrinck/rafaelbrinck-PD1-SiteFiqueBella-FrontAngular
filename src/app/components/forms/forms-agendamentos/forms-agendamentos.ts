// src/app/pages/form-agendamento/form-agendamento.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agendamento } from '../../../models/Agendamento';
import { Cliente } from '../../../models/cliente';
import { Servico } from '../../../models/servicos';
import { Funcionaria } from '../../../models/funcionarias';

@Component({
  selector: 'app-form-agendamento',
  imports: [CommonModule, FormsModule],
  templateUrl: './forms-agendamentos.html',
  styleUrls: ['./forms-agendamentos.css'],
})
export class FormAgendamentoComponent implements OnInit {
  @Input() agendamentoParaEditar: any;
  @Input() listaClientes: Cliente[] = [];
  @Input() listaServicos: Servico[] = [];
  @Input() listaFuncionarias: Funcionaria[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Agendamento>();

  isEditMode = false;
  agendamento: Agendamento = new Agendamento();

  dataAgendamento = '';
  horaInicio = '';
  horaFim = '';

  constructor() {}

  ngOnInit() {
    if (this.agendamentoParaEditar) {
      this.isEditMode = true;
      this.agendamento = {
        ...this.agendamentoParaEditar.extendedProps,
        id: this.agendamentoParaEditar.id,
      };

      // Separa data e hora para preencher os inputs
      const startDate = new Date(this.agendamentoParaEditar.start);
      this.dataAgendamento = startDate.toISOString().split('T')[0]; // Formato AAAA-MM-DD
      this.horaInicio = startDate.toTimeString().substring(0, 5); // Formato HH:MM

      const endDate = new Date(this.agendamentoParaEditar.end);
      this.horaFim = endDate.toTimeString().substring(0, 5); // Formato HH:MM
    }
  }

  onSubmit() {
    // Junta data e hora antes de salvar
    this.agendamento.start = `${this.dataAgendamento}T${this.horaInicio}`;
    this.agendamento.end = `${this.dataAgendamento}T${this.horaFim}`;
    this.save.emit(this.agendamento);
  }

  onCancel() {
    this.close.emit();
  }

  onDelete() {
    this.delete.emit(this.agendamento);
  }
}
