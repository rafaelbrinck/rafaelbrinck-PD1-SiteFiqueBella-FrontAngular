import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Agendamento, AgendamentoDB, StatusEnum } from '../../models/Agendamento';
import { AgendamentoService } from '../../services/agendamento-service';
import { ClienteService } from '../../services/cliente-service';
import { FuncionariasService } from '../../services/funcionarias-service';
import { ServicosService } from '../../services/servicos-service';
import { Cliente } from '../../models/cliente';
import { Funcionaria } from '../../models/funcionarias';
import { Servico } from '../../models/servicos';
import { DetalheAgendamento } from '../datalhes/detalhe-agendamento/detalhe-agendamento';

@Component({
  selector: 'app-agendamentos',
  imports: [CommonModule, DetalheAgendamento],
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css',
})
export class Agendamentos implements OnInit {
  listaAgendamentos: AgendamentoDB[] = [];
  listaClientes: Cliente[] = [];
  listaFuncionarias: Funcionaria[] = [];
  listaServicos: Servico[] = [];

  isModalDetalhesVisible: boolean = false;

  agendamentoSelecionado: Agendamento | null = null;
  clienteSelecionado: Cliente | null = null;
  servicoSelecionado: Servico | null = null;
  funcionariaSelecionada: Funcionaria | null = null;

  constructor(
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private funcionariaService: FuncionariasService,
    private servicoService: ServicosService
  ) {
    this.clienteService.listaClientes$.subscribe((lista) => {
      this.listaClientes = lista;
    });
    this.funcionariaService.listaFuncionarias$.subscribe((lista) => {
      this.listaFuncionarias = lista;
    });
    this.servicoService.listaServicos$.subscribe((lista) => {
      this.listaServicos = lista;
    });
  }

  ngOnInit(): void {
    this.agendamentoService.listaAgendamentosDB$.subscribe((lista) => {
      if (lista.length == 0) {
        this.agendamentoService.getAgendamentos().subscribe();
      }
      if (lista.length == this.listaAgendamentos.length) {
        return;
      }
      this.listaAgendamentos = lista;
    });
  }
  getServicoNome(servicoId: string): string {
    const servico = this.listaServicos.find((s) => s.servico_id === servicoId);
    return servico ? servico.nome! : 'Serviço não encontrado';
  }
  getClienteNome(clienteId: string): string {
    const cliente = this.listaClientes.find((c) => c.cliente_id === clienteId);
    return cliente ? cliente.nome! : 'Cliente não encontrado';
  }
  getFuncionariaNome(funcionariaId: string): string {
    const funcionaria = this.listaFuncionarias.find((f) => f.funcionario_id === funcionariaId);
    return funcionaria ? funcionaria.nome! : 'Funcionária não encontrada';
  }
  abrirModalParaEditar(agendamento: AgendamentoDB): void {}
  deletar(agendamentoId: string): void {}

  fecharModalDetalhes(): void {
    this.isModalDetalhesVisible = false;
    this.agendamentoSelecionado = null;
    this.clienteSelecionado = null;
    this.servicoSelecionado = null;
    this.funcionariaSelecionada = null;
  }
  abrirModalDetalhes(agendamento: AgendamentoDB): void {
    // Encontra os objetos completos nas suas listas
    this.clienteSelecionado =
      this.listaClientes.find((c) => c.cliente_id === agendamento.cliente_id) || null;
    this.servicoSelecionado =
      this.listaServicos.find((s) => s.servico_id === agendamento.servico_id) || null;
    this.funcionariaSelecionada =
      this.listaFuncionarias.find((f) => f.funcionario_id === agendamento.funcionaria_id) || null;

    // Define o agendamento
    this.agendamentoSelecionado = {
      id: agendamento.agendamento_id,
      start: agendamento.data_hora_inicio?.toString(),
      end: agendamento.data_hora_fim?.toString(),
      title: this.clienteSelecionado?.nome + ' - ' + this.servicoSelecionado?.nome,
      status: agendamento.status,
    };
    this.isModalDetalhesVisible = true;
  }

  getClasseDeStatus(status: StatusEnum | undefined): string {
    if (!status) {
      return 'bg-gray-100 text-gray-500 border-gray-300'; // Estilo Padrão
    }

    // A função agora retorna 3 classes: bg-*, text-*, border-*
    switch (status) {
      case StatusEnum.AGENDADO:
        // Fundo amarelo claro, texto amarelo escuro, borda amarela
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';

      case StatusEnum.CONCLUIDO:
        // Fundo verde claro, texto verde escuro, borda verde
        return 'bg-green-100 text-green-600 border-green-300';

      case StatusEnum.CANCELADO:
        // Fundo vermelho claro, texto vermelho escuro, borda vermelha
        return 'bg-red-100 text-red-600 border-red-300';

      default:
        return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  }
}
