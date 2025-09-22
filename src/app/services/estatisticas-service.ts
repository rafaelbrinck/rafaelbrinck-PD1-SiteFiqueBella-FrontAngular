// src/app/services/estatisticas.service.ts

import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HistoricoAgendamento } from '../models/IHistoricoAgendamento';

@Injectable({
  providedIn: 'root',
})
export class EstatisticasService {
  // Mocks para simular tabelas do banco de dados
  private servicosMock = [
    { id: 1, nome: 'Corte Feminino', preco: 85.0 },
    { id: 2, nome: 'Corte Masculino', preco: 45.0 },
    { id: 4, nome: 'Escova Progressiva', preco: 250.0 },
    { id: 5, nome: 'Coloração', preco: 120.0 },
    { id: 6, nome: 'Manicure', preco: 30.0 },
    { id: 9, nome: 'Limpeza de Pele', preco: 150.0 },
  ];
  private funcionariasMock = [
    { id: 1, nome: 'Juliana' },
    { id: 2, nome: 'Beatriz' },
    { id: 3, nome: 'Roberto' },
    { id: 4, nome: 'Vanessa' },
  ];

  private dadosFicticiosCompletos: HistoricoAgendamento[] = [];

  constructor() {
    this.dadosFicticiosCompletos = this._gerarDadosFicticios();
  }

  public async getDadosDashboard(periodo: 'Atual' | 'Passado'): Promise<any> {
    const hoje = new Date();
    const dadosFiltrados = this.dadosFicticiosCompletos.filter((dado) => {
      const dataAgendamento = new Date(dado.data);
      if (periodo === 'Atual') {
        return (
          dataAgendamento.getMonth() === hoje.getMonth() &&
          dataAgendamento.getFullYear() === hoje.getFullYear()
        );
      }
      if (periodo === 'Passado') {
        const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        return (
          dataAgendamento.getMonth() === mesPassado.getMonth() &&
          dataAgendamento.getFullYear() === mesPassado.getFullYear()
        );
      }
      return true;
    });

    const kpis = this._calcularKPIs(dadosFiltrados);
    const dadosGraficoFaturamento = this._processarGraficoFaturamento(dadosFiltrados);
    const dadosGraficoServicos = this._processarGraficoServicos(dadosFiltrados);
    const dadosGraficoEquipe = this._processarGraficoEquipe(dadosFiltrados);
    const dadosGraficoEquipeFaturamento =
      this._processarGraficoEquipePorFaturamento(dadosFiltrados);

    return {
      ...kpis,
      ...dadosGraficoFaturamento,
      ...dadosGraficoServicos,
      ...dadosGraficoEquipe,
      ...dadosGraficoEquipeFaturamento,
    };
  }

  private _calcularKPIs(dados: HistoricoAgendamento[]): any {
    const totalAtendimentos = dados.length;
    const faturamentoTotal = dados.reduce((sum, item) => sum + item.valor, 0);
    const ticketMedio = totalAtendimentos > 0 ? faturamentoTotal / totalAtendimentos : 0;
    const novosClientes = Math.floor(totalAtendimentos / 5);
    return { faturamentoTotal, totalAtendimentos, ticketMedio, novosClientes };
  }

  private _processarGraficoFaturamento(dados: HistoricoAgendamento[]): any {
    const faturamentoPorDia = dados.reduce((acc, dado) => {
      const dia = formatDate(dado.data, 'dd/MM', 'pt-BR');
      acc[dia] = (acc[dia] || 0) + dado.valor;
      return acc;
    }, {} as { [key: string]: number });

    const labelsOrdenados = Object.keys(faturamentoPorDia).sort((a, b) => {
      const [diaA, mesA] = a.split('/');
      const [diaB, mesB] = b.split('/');
      return (
        new Date(2025, Number(mesA) - 1, Number(diaA)).getTime() -
        new Date(2025, Number(mesB) - 1, Number(diaB)).getTime()
      );
    });

    return {
      lineChartData: {
        labels: labelsOrdenados,
        datasets: [
          {
            data: labelsOrdenados.map((label) => faturamentoPorDia[label]),
            label: 'Faturamento',
            fill: true,
            tension: 0.3,
            borderColor: 'rgba(236, 72, 153, 1)',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
          },
        ],
      },
    };
  }

  private _processarGraficoServicos(dados: HistoricoAgendamento[]): any {
    const faturamentoPorServico = dados.reduce((acc, dado) => {
      const servico = this.servicosMock.find((s) => s.id === dado.servico_id);
      if (servico) {
        acc[servico.nome] = (acc[servico.nome] || 0) + dado.valor;
      }
      return acc;
    }, {} as { [key: string]: number });

    const servicosOrdenados = Object.entries(faturamentoPorServico).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    );

    return {
      servicosFaturamentoChartData: {
        labels: servicosOrdenados.map((item) => item[0]),
        datasets: [
          {
            data: servicosOrdenados.map((item) => item[1]),
            label: 'Faturamento por Serviço',
            backgroundColor: '#fbcfe8',
            borderColor: '#ec4899',
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
    };
  }

  private _processarGraficoEquipe(dados: HistoricoAgendamento[]): any {
    const atendimentosPorFuncionaria = dados.reduce((acc, dado) => {
      const func = this.funcionariasMock.find((f) => f.id === dado.funcionaria_id);
      if (func) {
        acc[func.nome] = (acc[func.nome] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    return {
      equipeChartData: {
        labels: Object.keys(atendimentosPorFuncionaria),
        datasets: [
          {
            data: Object.values(atendimentosPorFuncionaria),
            label: 'Nº de Atendimentos',
            backgroundColor: [
              'rgba(236, 72, 153, 0.6)',
              'rgba(217, 70, 239, 0.6)',
              'rgba(168, 85, 247, 0.6)',
              'rgba(139, 92, 246, 0.6)',
            ],
            borderColor: ['#ec4899', '#d946ef', '#a855f7', '#8b5cf6'],
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
    };
  }

  private _processarGraficoEquipePorFaturamento(dados: HistoricoAgendamento[]): any {
    const faturamentoPorFuncionaria = dados.reduce((acc, dado) => {
      const func = this.funcionariasMock.find((f) => f.id === dado.funcionaria_id);

      if (func) {
        acc[func.nome] = (acc[func.nome] || 0) + dado.valor;
      }

      return acc;
    }, {} as { [key: string]: number });

    return {
      equipeFaturamentoChartData: {
        labels: Object.keys(faturamentoPorFuncionaria),
        datasets: [
          {
            data: Object.values(faturamentoPorFuncionaria),
            label: 'Faturamento Gerado',
            backgroundColor: 'rgba(236, 72, 153, 0.6)',
            borderColor: '#ec4899',
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
    };
  }

  private _gerarDadosFicticios(): HistoricoAgendamento[] {
    const dados: HistoricoAgendamento[] = [];
    const hoje = new Date();
    for (let i = 0; i < 90; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      const numAtendimentos = Math.floor(Math.random() * 8) + 5;
      for (let j = 0; j < numAtendimentos; j++) {
        const servico = this.servicosMock[Math.floor(Math.random() * this.servicosMock.length)];
        const funcionaria =
          this.funcionariasMock[Math.floor(Math.random() * this.funcionariasMock.length)];
        dados.push({
          data: new Date(data),
          valor: servico.preco,
          servico_id: servico.id,
          funcionaria_id: funcionaria.id,
        });
      }
    }
    return dados;
  }
}
