import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Enviroment } from '../enviroments/enviroment';
import { AuthService } from './auth-service';

// Interface que reflete o JSON exato que sua função SQL retorna
interface DashboardResponse {
  kpis: {
    faturamentoTotal: number;
    totalAtendimentos: number;
    ticketMedio: number;
  };
  novosClientes: number;
  graficoFaturamentoDia: Array<{ label: string; valor: number }>;
  graficoServicos: Array<{ label: string; valor: number }>;
  graficoEquipe: Array<{ label: string; quantidade: number; valor: number }>;
}

@Injectable({
  providedIn: 'root',
})
export class EstatisticasService {
  // Aponta para a rota da sua API que chama a função RPC 'get_dashboard_stats'
  private apiUrl = `${Enviroment.apiUrl}/estatisticas/dash`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public async getDadosDashboard(periodo: 'Atual' | 'Passado'): Promise<any> {
    const { inicio, fim } = this._calcularDatas(periodo);
    const header = this.authService.getHeader();
    if (!header) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // 1. Chama a API. Espera receber o Objeto JSON estruturado (DashboardResponse)
      const dadosDoBanco = await firstValueFrom(
        this.http.post<DashboardResponse>(
          this.apiUrl,
          {
            data_inicio: inicio.toISOString(),
            data_fim: fim.toISOString(),
          },
          { headers: header }
        )
      );

      // 2. Se o banco retornar vazio ou nulo, entrega objeto zerado para não quebrar a tela
      if (!dadosDoBanco) {
        return this._objetoVazio();
      }

      // 3. Formata os dados brutos do banco para o formato visual do Chart.js
      return this._formatarDadosParaComponente(dadosDoBanco);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      return this._objetoVazio();
    }
  }

  // --- FORMATAÇÃO (Transforma JSON do Banco em Gráficos) ---
  private _formatarDadosParaComponente(dados: DashboardResponse) {
    // KPIs
    const kpis = dados.kpis || { faturamentoTotal: 0, totalAtendimentos: 0, ticketMedio: 0 };
    const novosClientes = dados.novosClientes || 0;

    // 1. Gráfico Linha (Evolução Diária)
    const dias = dados.graficoFaturamentoDia || [];
    const lineChartData = {
      labels: dias.map((d) => d.label),
      datasets: [
        {
          data: dias.map((d) => d.valor),
          label: 'Faturamento',
          fill: true,
          tension: 0.3,
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          pointBackgroundColor: '#ec4899',
          pointBorderColor: '#fff',
        },
      ],
    };

    // 2. Gráfico Serviços (Barras Horizontais)
    const servicos = dados.graficoServicos || [];
    const servicosFaturamentoChartData = {
      labels: servicos.map((s) => s.label),
      datasets: [
        {
          data: servicos.map((s) => s.valor),
          label: 'Faturamento',
          backgroundColor: '#fbcfe8',
          borderColor: '#ec4899',
          borderWidth: 2,
          borderRadius: 4,
          hoverBackgroundColor: '#f9a8d4',
        },
      ],
    };

    // 3. Gráficos Equipe (Quantidade e Faturamento vêm da mesma lista do banco)
    const equipe = dados.graficoEquipe || [];

    // 3.1 Equipe - Quantidade
    const equipeChartData = {
      labels: equipe.map((e) => e.label),
      datasets: [
        {
          data: equipe.map((e) => e.quantidade),
          label: 'Atendimentos',
          backgroundColor: 'rgba(168, 85, 247, 0.6)', // Roxo
          borderColor: '#a855f7',
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };

    // 3.2 Equipe - Faturamento
    const equipeFaturamentoChartData = {
      labels: equipe.map((e) => e.label),
      datasets: [
        {
          data: equipe.map((e) => e.valor),
          label: 'Faturamento',
          backgroundColor: 'rgba(236, 72, 153, 0.6)', // Rosa
          borderColor: '#ec4899',
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };

    // Retorna o objeto final que o seu componente espera
    return {
      faturamentoTotal: kpis.faturamentoTotal,
      totalAtendimentos: kpis.totalAtendimentos,
      ticketMedio: kpis.ticketMedio,
      novosClientes: novosClientes,
      lineChartData,
      servicosFaturamentoChartData,
      equipeChartData,
      equipeFaturamentoChartData,
    };
  }

  private _calcularDatas(periodo: 'Atual' | 'Passado') {
    const hoje = new Date();
    let inicio: Date, fim: Date;

    if (periodo === 'Atual') {
      inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);
    } else {
      inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      fim = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 23, 59, 59);
    }
    return { inicio, fim };
  }

  private _objetoVazio() {
    return {
      faturamentoTotal: 0,
      totalAtendimentos: 0,
      ticketMedio: 0,
      novosClientes: 0,
      lineChartData: { labels: [], datasets: [] },
      servicosFaturamentoChartData: { labels: [], datasets: [] },
      equipeChartData: { labels: [], datasets: [] },
      equipeFaturamentoChartData: { labels: [], datasets: [] },
    };
  }
}
