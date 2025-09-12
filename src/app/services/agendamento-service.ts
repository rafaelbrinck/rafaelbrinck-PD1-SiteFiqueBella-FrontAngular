// src/app/services/agendamento.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importe o 'of' do RxJS
import { delay } from 'rxjs/operators'; // Opcional: para simular a demora da rede
import { Cliente } from '../models/cliente';
import { Servico } from '../models/servicos';
import { ClienteService } from './cliente-service';
import { ServicosService } from './servicos-service';

// A interface continua a mesma, garantindo o "contrato"
export interface Agendamento {
  id: number | string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    cliente_id: number;
    funcionaria_id: number;
    servico_id: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  listaClientes: Cliente[] = [];
  listaServicos: Servico[] = [];

  constructor(private clienteService: ClienteService, private servicoService: ServicosService) {
    this.clienteService.listaClientes$.subscribe((clientes) => {
      this.listaClientes = clientes;
    });
    this.servicoService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
  }

  // Este é o método que vamos "mockar"
  getAgendamentos(): Observable<Agendamento[]> {
    console.log('Serviço foi chamado! Retornando dados FAKES (mock).');

    // Criamos uma data base para os nossos agendamentos fictícios
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Garante dois dígitos para o mês
    const dia = hoje.getDate().toString().padStart(2, '0'); // Garante dois dígitos para o dia

    // Criamos um array de agendamentos em memória
    const agendamentosBase = [
      {
        id: 1,
        start: `${ano}-${mes}-${dia}T09:00:00`,
        end: `${ano}-${mes}-${dia}T11:00:00`,
        cliente_id: 3,
        funcionaria_id: 1,
        servico_id: 5,
      },
      {
        id: 2,
        start: `${ano}-${mes}-${dia}T11:00:00`,
        end: `${ano}-${mes}-${dia}T12:00:00`,
        cliente_id: 1,
        funcionaria_id: 2,
        servico_id: 6,
      },
      {
        id: 3,
        start: `${ano}-${mes}-${dia}T14:00:00`,
        end: `${ano}-${mes}-${dia}T17:00:00`,
        cliente_id: 5,
        funcionaria_id: 1,
        servico_id: 4,
      },
      {
        id: 4,
        start: this.adicionarDias(hoje, 1, 0, 10, 0).toISOString().substring(0, 19),
        end: this.adicionarDias(hoje, 1, 0, 10, 45).toISOString().substring(0, 19),
        cliente_id: 4,
        funcionaria_id: 3,
        servico_id: 2,
      },
      {
        id: 5,
        start: this.adicionarDias(hoje, -1, 0, 18, 0).toISOString().substring(0, 19),
        end: this.adicionarDias(hoje, -1, 1, 18, 0).toISOString().substring(0, 19),
        cliente_id: 7,
        funcionaria_id: 4,
        servico_id: 9,
      },
    ];

    const agendamentosFicticios: Agendamento[] = agendamentosBase.map((ag) => {
      const cliente = this.listaClientes.find((c) => c.id === ag.cliente_id);
      const servico = this.listaServicos.find((s) => s.id === ag.servico_id);

      return {
        id: ag.id,
        title: `${servico?.nome} - ${cliente?.nome}`, // Título dinâmico!
        start: ag.start,
        end: ag.end,
        backgroundColor: servico?.cor || '#6b7280', // Usa a cor do serviço ou uma cor padrão
        borderColor: servico?.cor || '#6b7280',
        extendedProps: {
          cliente_id: ag.cliente_id,
          funcionaria_id: ag.funcionaria_id,
          servico_id: ag.servico_id,
        },
      };
    });

    // Usamos o operador 'of' do RxJS para retornar o array como um Observable,
    // assim como o HttpClient faria.
    // O 'delay(500)' simula o tempo de espera de uma chamada de rede real (meio segundo).
    return of(agendamentosFicticios).pipe(delay(500));
  }

  // Função auxiliar para manipular datas facilmente
  private adicionarDias(
    data: Date,
    dias: number,
    horas: number = 0,
    horaInicial: number = 9,
    minutosIniciais: number = 0
  ): Date {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    novaData.setHours(horaInicial + horas, minutosIniciais, 0, 0); // Zera segundos e milissegundos
    return novaData;
  }
}
