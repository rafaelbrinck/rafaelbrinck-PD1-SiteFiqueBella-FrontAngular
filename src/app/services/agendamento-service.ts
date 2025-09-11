// src/app/services/agendamento.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importe o 'of' do RxJS
import { delay } from 'rxjs/operators'; // Opcional: para simular a demora da rede

// A interface continua a mesma, garantindo o "contrato"
export interface Agendamento {
  id?: number | string;
  title: string;
  start: string;
  end: string;
  extendedProps?: any;
  // Você pode adicionar cores para diferenciar serviços
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  // Não vamos usar o HttpClient por enquanto, mas podemos deixar injetado.
  // constructor(private http: HttpClient) { }
  constructor() {}

  // Este é o método que vamos "mockar"
  getAgendamentos(): Observable<Agendamento[]> {
    console.log('Serviço foi chamado! Retornando dados FAKES (mock).');

    // Criamos uma data base para os nossos agendamentos fictícios
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Garante dois dígitos para o mês
    const dia = hoje.getDate().toString().padStart(2, '0'); // Garante dois dígitos para o dia

    // Criamos um array de agendamentos em memória
    const agendamentosFicticios: Agendamento[] = [
      {
        id: 1,
        title: 'Corte Masculino - Carlos Pereira',
        start: `${ano}-${mes}-${dia}T09:00:00`,
        end: `${ano}-${mes}-${dia}T09:45:00`,
        backgroundColor: '#3788d8', // Azul padrão
        borderColor: '#3788d8',
      },
      {
        id: 2,
        title: 'Manicure e Pedicure - Sofia Almeida',
        start: `${ano}-${mes}-${dia}T10:00:00`,
        end: `${ano}-${mes}-${dia}T11:30:00`,
        backgroundColor: '#e35a76', // Um tom de rosa
        borderColor: '#e35a76',
      },
      {
        id: 3,
        title: 'Coloração - Ricardo Neves',
        start: `${ano}-${mes}-${dia}T14:00:00`,
        end: `${ano}-${mes}-${dia}T16:00:00`,
        backgroundColor: '#8a4d1a', // Um tom de marrom para coloração
        borderColor: '#8a4d1a',
      },
      // Agendamento para amanhã
      {
        id: 4,
        title: 'Escova Progressiva - Fernanda Costa',
        start: this.adicionarDias(hoje, 1).toISOString().substring(0, 19), // Usando um helper para o dia seguinte
        end: this.adicionarDias(hoje, 1, 3).toISOString().substring(0, 19), // Duração de 3 horas
        backgroundColor: '#28a745', // Verde
        borderColor: '#28a745',
      },
      // Agendamento para ontem
      {
        id: 5,
        title: 'Limpeza de Pele - Joana Martins',
        start: this.adicionarDias(hoje, -1, 0, 15, 30).toISOString().substring(0, 19), // Ontem às 15:30
        end: this.adicionarDias(hoje, -1, 1, 15, 30).toISOString().substring(0, 19), // Duração de 1 hora
        backgroundColor: '#f5b041', // Laranja
        borderColor: '#f5b041',
      },
    ];

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
