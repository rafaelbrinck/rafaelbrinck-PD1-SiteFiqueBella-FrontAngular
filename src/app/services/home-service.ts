// src/app/services/home.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Enviroment } from '../enviroments/enviroment';
import { AuthService } from './auth-service';

// Interface que reflete o JSON que criamos no SQL
interface HomeDashboardResponse {
  kpis: {
    agendamentosHoje: number;
    faturamentoPrevisto: number;
    faturamentoRealizado: number;
    clientesNovos: number;
  };
  proximosAtendimentos: Array<{
    data: string;
    duracao: number;
    cliente: string;
    servico: string;
    funcionaria: string;
  }>;
  aniversariantes: Array<{
    nome: string;
    data: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // Ajuste a URL conforme sua API (se for Node ou Supabase direto)
  private apiUrl = `${Enviroment.apiUrl}/estatisticas/home`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public async getDadosHome(): Promise<any> {
    try {
      const header = this.authService.getHeader();
      if (!header) throw new Error('Usuário não autenticado');
      // Chama a função SQL (sem parâmetros, pois ela usa CURRENT_DATE)
      const response = await firstValueFrom(
        this.http.get<HomeDashboardResponse>(this.apiUrl, { headers: header })
      );

      if (!response) return this._objetoVazio();

      return this._formatarParaFrontend(response);
    } catch (error) {
      console.error('Erro ao buscar dados da Home:', error);
      return this._objetoVazio();
    }
  }

  private _formatarParaFrontend(dados: HomeDashboardResponse) {
    const hoje = new Date();

    // Formata os Próximos Atendimentos
    const proximosAtendimentos = dados.proximosAtendimentos.map((ag) => ({
      hora: formatDate(ag.data, 'HH:mm', 'pt-BR'),
      duracao: Math.round(ag.duracao), // Garante inteiro
      servico: ag.servico,
      cliente: ag.cliente,
      funcionaria: ag.funcionaria,
    }));

    // Formata os Aniversariantes
    const aniversariantesDaSemana = dados.aniversariantes.map((niver) => {
      // Lógica para verificar se é hoje e formatar a data bonita
      const dataNasc = new Date(niver.data);
      // Cria uma data neste ano para comparar
      const niverEsteAno = new Date(hoje.getFullYear(), dataNasc.getMonth(), dataNasc.getDate()); // Ajuste conforme fuso se necessário

      // Comparação simples de dia/mês
      const ehHoje =
        niverEsteAno.getDate() === hoje.getDate() && niverEsteAno.getMonth() === hoje.getMonth();

      return {
        nome: niver.nome,
        data: ehHoje ? 'Hoje!' : formatDate(niverEsteAno, "dd 'de' MMMM", 'pt-BR'),
        ehHoje: ehHoje,
      };
    });

    return {
      agendamentosHoje: dados.kpis.agendamentosHoje,
      faturamentoPrevisto: dados.kpis.faturamentoPrevisto,
      faturamentoRealizado: dados.kpis.faturamentoRealizado,
      clientesNovos: dados.kpis.clientesNovos,
      proximosAtendimentos,
      aniversariantesDaSemana,
    };
  }

  private _objetoVazio() {
    return {
      agendamentosHoje: 0,
      faturamentoPrevisto: 0,
      clientesNovos: 0,
      proximosAtendimentos: [],
      aniversariantesDaSemana: [],
    };
  }
}
