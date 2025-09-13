// src/app/services/agendamento.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs'; // Importe o 'of' do RxJS
import { delay } from 'rxjs/operators'; // Opcional: para simular a demora da rede
import { Cliente } from '../models/cliente';
import { Servico } from '../models/servicos';
import { ClienteService } from './cliente-service';
import { ServicosService } from './servicos-service';

// A interface continua a mesma, garantindo o "contrato"
export interface Agendamento {
  id?: number | string;
  title?: string;
  start?: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    cliente_id?: number | null;
    funcionaria_id?: number | null;
    servico_id?: number | null;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  listaClientes: Cliente[] = [];
  listaServicos: Servico[] = [];

  hoje: Date = new Date();
  ano: number = this.hoje.getFullYear();
  mes: string = (this.hoje.getMonth() + 1).toString().padStart(2, '0');
  dia: string = this.hoje.getDate().toString().padStart(2, '0');

  agendamentosBase = [
    {
      id: 1,
      start: `${this.ano}-${this.mes}-${this.dia}T09:00:00`,
      end: `${this.ano}-${this.mes}-${this.dia}T11:00:00`,
      cliente_id: 3,
      funcionaria_id: 1,
      servico_id: 5,
    },
    {
      id: 2,
      start: `${this.ano}-${this.mes}-${this.dia}T11:00:00`,
      end: `${this.ano}-${this.mes}-${this.dia}T12:00:00`,
      cliente_id: 1,
      funcionaria_id: 2,
      servico_id: 6,
    },
    {
      id: 3,
      start: `${this.ano}-${this.mes}-${this.dia}T14:00:00`,
      end: `${this.ano}-${this.mes}-${this.dia}T17:00:00`,
      cliente_id: 5,
      funcionaria_id: 1,
      servico_id: 4,
    },
    {
      id: 4,
      start: this.adicionarDias(this.hoje, 1, 0, 10, 0).toISOString().substring(0, 19),
      end: this.adicionarDias(this.hoje, 1, 0, 10, 45).toISOString().substring(0, 19),
      cliente_id: 4,
      funcionaria_id: 3,
      servico_id: 2,
    },
    {
      id: 5,
      start: this.adicionarDias(this.hoje, -1, 0, 18, 0).toISOString().substring(0, 19),
      end: this.adicionarDias(this.hoje, -1, 1, 18, 0).toISOString().substring(0, 19),
      cliente_id: 7,
      funcionaria_id: 4,
      servico_id: 9,
    },
  ];

  private listaAgendamentosSubject = new BehaviorSubject<Agendamento[]>([]);
  listaAgendamentos$ = this.listaAgendamentosSubject.asObservable();

  constructor(private clienteService: ClienteService, private servicoService: ServicosService) {
    this.clienteService.listaClientes$.subscribe((clientes) => {
      this.listaClientes = clientes;
    });
    this.servicoService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
    this.getAgendamentos();
  }

  // Este é o método que vamos "mockar"
  getAgendamentos(): Observable<Agendamento[]> {
    console.log('Serviço foi chamado! Retornando dados FAKES (mock).');

    const agendamentosFicticios: Agendamento[] = this.agendamentosBase.map((ag) => {
      const cliente = this.listaClientes.find((c) => c.id === ag.cliente_id);
      const servico = this.listaServicos.find((s) => s.id === ag.servico_id);

      return {
        id: ag.id,
        title: `${servico?.nome} - ${cliente?.nome}`,
        start: ag.start,
        end: ag.end,
        backgroundColor: servico?.cor || '#6b7280',
        borderColor: servico?.cor || '#6b7280',
        extendedProps: {
          cliente_id: ag.cliente_id,
          funcionaria_id: ag.funcionaria_id,
          servico_id: ag.servico_id,
        },
      };
    });

    this.listaAgendamentosSubject.next(agendamentosFicticios);
    return of(agendamentosFicticios).pipe(delay(500));
  }

  private adicionarDias(
    data: Date,
    dias: number,
    horas: number = 0,
    horaInicial: number = 9,
    minutosIniciais: number = 0
  ): Date {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    novaData.setHours(horaInicial + horas, minutosIniciais, 0, 0);
    return novaData;
  }
}
