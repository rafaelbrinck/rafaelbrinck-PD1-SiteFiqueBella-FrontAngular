import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home-service';
import { FormAgendamentoComponent } from '../../components/forms/forms-agendamentos/forms-agendamentos';
import { AgendamentoDB } from '../../models/Agendamento';
import { AgendamentoService } from '../../services/agendamento-service';
import { Cliente } from '../../models/cliente';
import { Funcionaria } from '../../models/funcionarias';
import { Servico } from '../../models/servicos';
import { ClienteService } from '../../services/cliente-service';
import { FuncionariasService } from '../../services/funcionarias-service';
import { ServicosService } from '../../services/servicos-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormAgendamentoComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  agendamentosHoje = 0;
  faturamentoPrevisto = 0;
  faturamentoRealizado = 0;
  porcentagemFaturamento = 0;
  clientesNovos = 0;
  proximosAtendimentos: any[] = [];
  aniversariantesDaSemana: any[] = [];
  hojeFormatado: string = '';

  listaClientes: Cliente[] = [];
  listaFuncionarias: Funcionaria[] = [];
  listaServicos: Servico[] = [];
  agendamentoSelecionado: any | null = null;

  constructor(
    private homeService: HomeService,
    private router: Router,
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private funcionariaService: FuncionariasService,
    private servicoService: ServicosService
  ) {}

  async ngOnInit() {
    this.carregarDados();
    // No ngOnInit ou onde você carrega os dados
    this.hojeFormatado = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    // Capitalize a primeira letra se quiser (ex: "Sexta-feira...")
    this.hojeFormatado = this.hojeFormatado.charAt(0).toUpperCase() + this.hojeFormatado.slice(1);

    this.clienteService.listaClientes$.subscribe((clientes) => {
      this.listaClientes = clientes;
    });
    this.funcionariaService.listaFuncionarias$.subscribe((funcionarias) => {
      this.listaFuncionarias = funcionarias;
    });
    this.servicoService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
  }

  async carregarDados() {
    const dados = await this.homeService.getDadosHome();

    this.agendamentosHoje = dados.agendamentosHoje;
    this.faturamentoPrevisto = dados.faturamentoPrevisto;
    this.faturamentoRealizado = dados.faturamentoRealizado;
    this.clientesNovos = dados.clientesNovos;
    this.proximosAtendimentos = dados.proximosAtendimentos;
    this.aniversariantesDaSemana = dados.aniversariantesDaSemana;
    this.porcentagemFaturamento =
      this.faturamentoPrevisto > 0
        ? (this.faturamentoRealizado / this.faturamentoPrevisto) * 100
        : 0;
  }

  novoAgendamento() {
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60000); // Adiciona 30 minutos
    this.agendamentoSelecionado = {
      start: start,
      end: end,
      extendedProps: { cliente_id: null, servico_id: null, funcionaria_id: null },
    };
  } // Ajuste a rota
  irParaAgendaCompleta() {
    this.router.navigate(['/agendamentos']);
  }

  salvarAgendamento(agendamento: AgendamentoDB) {
    this.agendamentoService.adicionarAgendamento(agendamento);
    this.fecharModal();
  }
  fecharModal() {
    this.agendamentoSelecionado = null;
  }
}
