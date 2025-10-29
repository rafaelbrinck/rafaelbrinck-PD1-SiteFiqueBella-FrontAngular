// src/app/pages/estatisticas/estatisticas.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EstatisticasService } from '../../services/estatisticas-service';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-estatisticas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './estatisticas.html',
  styleUrls: ['./estatisticas.css'],
})
export class EstatisticasComponent implements OnInit {
  faturamentoTotal = 0;
  totalAtendimentos = 0;
  ticketMedio = 0;
  novosClientes = 0;

  periodoSelecionado: 'Atual' | 'Passado' = 'Atual';

  private moedaBR = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  public lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => this.moedaBR.format(value as number),
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Faturamento: ${this.moedaBR.format(context.raw as number)}`,
        },
      },
      datalabels: {
        display: false,
      },
    },
  };
  public lineChartType: ChartType = 'line';

  public servicosFaturamentoChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public servicosFaturamentoChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    scales: {
      x: { beginAtZero: true },
      y: {
        ticks: {
          callback: (value) => this.moedaBR.format(value as number),
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `Faturamento por Serviço: ${this.moedaBR.format(context.raw as number)}`,
        },
      },
      datalabels: {
        color: '#4b5563',
        font: { weight: 'bold' },
        formatter: (value) => this.moedaBR.format(value),
      },
    },
  };
  public servicosFaturamentoChartType: ChartType = 'bar';

  public equipeChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  public equipeChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: false } },
  };
  public equipeChartType: ChartType = 'bar';

  public equipeFaturamentoChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  public equipeFaturamentoChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    scales: {
      x: {
        beginAtZero: true,
      },
      y: { grid: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Faturamento: ${this.moedaBR.format(context.raw as number)}`,
        },
      },
      datalabels: {
        color: '#4b5563',
        font: { weight: 'bold' },
        formatter: (value) => this.moedaBR.format(value),
      },
    },
  };
  public equipeFaturamentoChartType: ChartType = 'bar';

  constructor(private estatisticasService: EstatisticasService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  selecionarPeriodo(periodo: 'Atual' | 'Passado'): void {
    this.periodoSelecionado = periodo;
    this.carregarDados();
  }

  async carregarDados(): Promise<void> {
    try {
      const dadosDashboard = await this.estatisticasService.getDadosDashboard(
        this.periodoSelecionado
      );

      this.faturamentoTotal = dadosDashboard.faturamentoTotal;
      this.totalAtendimentos = dadosDashboard.totalAtendimentos;
      this.ticketMedio = dadosDashboard.ticketMedio;
      this.novosClientes = dadosDashboard.novosClientes;

      this.lineChartData = dadosDashboard.lineChartData;
      this.servicosFaturamentoChartData = dadosDashboard.servicosFaturamentoChartData;
      this.equipeChartData = dadosDashboard.equipeChartData;
      this.equipeFaturamentoChartData = dadosDashboard.equipeFaturamentoChartData;
    } catch (error) {
      console.error('[COMPONENTE] Erro ao carregar dados:', error);
    }
  }
}
