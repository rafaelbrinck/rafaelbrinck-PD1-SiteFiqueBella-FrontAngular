// src/app/pages/form-agendamento/form-agendamento.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agendamento, AgendamentoDB, StatusEnum } from '../../../models/Agendamento';
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

  servicosFiltrados: Servico[] = [];
  private listaServicosBD: Servico[] = [];

  constructor() {}

  ngOnInit() {
    this.listaServicosBD = [...this.listaServicos];

    if (this.agendamentoParaEditar) {
      this.isEditMode = true;
      this.agendamento = {
        ...this.agendamentoParaEditar.extendedProps,
        id: this.agendamentoParaEditar.id,
      };

      const startDate = new Date(this.agendamentoParaEditar.start);
      this.dataAgendamento = startDate.toISOString().split('T')[0];
      this.horaInicio = startDate.toTimeString().substring(0, 5);

      const endDate = new Date(this.agendamentoParaEditar.end);
      this.horaFim = endDate.toTimeString().substring(0, 5);

      if (this.agendamento.funcionaria_id) {
        this.filtrarServicosPorFunc(this.agendamento.funcionaria_id);
      }
    } else {
      this.servicosFiltrados = [];
    }
  }

  onSubmit() {
    var agendamentoDB = new AgendamentoDB();
    if (this.agendamento.id) {
      agendamentoDB.agendamento_id = this.agendamento.id;
    }
    agendamentoDB.cliente_id = this.agendamento.cliente_id as string;
    agendamentoDB.funcionaria_id = this.agendamento.funcionaria_id as string;
    agendamentoDB.servico_id = this.agendamento.servico_id as string;
    agendamentoDB.data_hora_inicio = new Date(`${this.dataAgendamento}T${this.horaInicio}`);
    agendamentoDB.data_hora_fim = new Date(`${this.dataAgendamento}T${this.horaFim}`);
    agendamentoDB.status = StatusEnum.AGENDADO;

    this.save.emit(agendamentoDB);
  }

  adaptarHoraPorServico(servicoId: string) {
    const servico = this.listaServicosBD.find((s) => s.servico_id === servicoId);
    if (!servico) {
      return;
    }
    if (servico.duracao) {
      const [hora, minuto] = this.horaInicio.split(':').map(Number);
      const duracaoMinutos = servico.duracao;
      const dataInicio = new Date(0, 0, 0, hora, minuto);
      dataInicio.setMinutes(dataInicio.getMinutes() + duracaoMinutos);
      const horaFimAdaptada = dataInicio.toTimeString().substring(0, 5);
      this.horaFim = horaFimAdaptada;
    }
  }

  filtroFuncionaria(funcionariaId: string | null) {
    if (funcionariaId) {
      this.filtrarServicosPorFunc(funcionariaId);
    } else {
      this.servicosFiltrados = [];
    }
    this.agendamento.servico_id = null;
  }

  private filtrarServicosPorFunc(funcionariaId: string) {
    const funcionaria = this.listaFuncionarias.find((f) => f.funcionario_id === funcionariaId);

    if (funcionaria && funcionaria.especialidades) {
      this.servicosFiltrados = [];
      funcionaria.especialidades.forEach((servicoId) => {
        const servico = this.listaServicosBD.find((s) => s.servico_id === servicoId);
        if (servico && !this.servicosFiltrados.includes(servico)) {
          this.servicosFiltrados.push(servico);
        }
      });
    } else {
      this.servicosFiltrados = [];
    }
  }

  onCancel() {
    this.close.emit();
  }

  onDelete() {
    this.delete.emit(this.agendamento);
  }
}
