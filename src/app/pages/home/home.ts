import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Agendamento } from '../../models/Agendamento';
import { Cliente } from '../../models/cliente';
import { Servico } from '../../models/servicos';
import { Funcionaria } from '../../models/funcionarias';
import { AgendamentoService } from '../../services/agendamento-service';
import { ClienteService } from '../../services/cliente-service';
import { ServicosService } from '../../services/servicos-service';
import { FuncionariasService } from '../../services/funcionarias-service';
import { Aniversariante } from '../../models/IAniversariante';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
  agendamentosHoje: number = 0;
  faturamentoPrevisto: number = 0;
  clientesNovos: number = 0;

  // Corrigir o problema para importar a interface IProximoAtendimento
  proximosAtendimentos: any[] = [];
  aniversariantesDaSemana: Aniversariante[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private servicosService: ServicosService,
    private funcionariasService: FuncionariasService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.agendamentoService.listaAgendamentos$,
      this.clienteService.listaClientes$,
      this.servicosService.listaServicos$,
      this.funcionariasService.listaFuncionarias$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([agendamentos, clientes, servicos, funcionarias]) => {
        this._processarDadosDashboard(agendamentos, clientes, servicos, funcionarias);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _processarDadosDashboard(
    agendamentos: Agendamento[],
    clientes: Cliente[],
    servicos: Servico[],
    funcionarias: Funcionaria[]
  ): void {
    const hoje = new Date();

    const agendamentosDoDia = agendamentos.filter((ag) => {
      const dataAgendamento = new Date(ag.start!);
      return dataAgendamento.toDateString() === hoje.toDateString();
    });

    this.agendamentosHoje = agendamentosDoDia.length;
    this.faturamentoPrevisto = agendamentosDoDia.reduce((total, ag) => {
      const servico = servicos.find((s) => s.id === ag.extendedProps!.servico_id);
      return total + (servico?.valor || 0);
    }, 0);
    this.clientesNovos = 3;

    // PRÓXIMOS ATENDIMENTOS
    this.proximosAtendimentos = agendamentosDoDia
      .filter((ag) => new Date(ag.start!) > hoje)
      .sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime())
      .slice(0, 4)
      .map((ag) => {
        const cliente = clientes.find((c) => c.id === ag.extendedProps!.cliente_id);
        const servico = servicos.find((s) => s.id === ag.extendedProps!.servico_id);
        const funcionaria = funcionarias.find((f) => f.id === ag.extendedProps!.funcionaria_id);
        const duracao = (new Date(ag.end!).getTime() - new Date(ag.start!).getTime()) / 60000;

        return {
          hora: formatDate(ag.start!, 'HH:mm', 'pt-BR'),
          duracao: duracao,
          servico: servico?.nome || 'Serviço não encontrado',
          cliente: cliente?.nome || 'Cliente não encontrado',
          funcionaria: funcionaria?.nome || 'Profissional não encontrado',
        };
      });

    // ANIVERSARIANTES DA SEMANA
    const hojeSemHoras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const daquiSeteDias = new Date(hojeSemHoras.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.aniversariantesDaSemana = clientes
      .map((cliente) => {
        const [ano, mes, dia] = cliente.data_nascimento!.split('-').map(Number);
        const niverEsteAno = new Date(hoje.getFullYear(), mes - 1, dia);
        return { ...cliente, niverEsteAno };
      })
      .filter(
        (cliente) => cliente.niverEsteAno >= hojeSemHoras && cliente.niverEsteAno < daquiSeteDias
      )
      .sort((a, b) => a.niverEsteAno.getTime() - b.niverEsteAno.getTime())
      .map((cliente) => {
        const ehHoje = cliente.niverEsteAno.toDateString() === hojeSemHoras.toDateString();
        return {
          nome: `${cliente.nome} ${cliente.sobrenome}`,
          data: ehHoje
            ? `Hoje, ${formatDate(cliente.niverEsteAno, "d 'de' MMMM", 'pt-BR')}!`
            : formatDate(cliente.niverEsteAno, "EEEE, d 'de' MMMM", 'pt-BR'),
          ehHoje: ehHoje,
        };
      });
  }

  novoAgendamento(): void {
    this.router.navigate(['/agendamentos']);
  }

  irParaAgendaCompleta(): void {
    this.router.navigate(['/agendamentos']);
  }
}
