import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AgendamentoDB } from '../../models/Agendamento';
import { AgendamentoService } from '../../services/agendamento-service';
import { ClienteService } from '../../services/cliente-service';
import { FuncionariasService } from '../../services/funcionarias-service';
import { ServicosService } from '../../services/servicos-service';
import { Cliente } from '../../models/cliente';
import { Funcionaria } from '../../models/funcionarias';
import { Servico } from '../../models/servicos';

@Component({
  selector: 'app-agendamentos',
  imports: [CommonModule],
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css',
})
export class Agendamentos implements OnInit {
  listaAgendamentos: AgendamentoDB[] = [];
  listaClientes: Cliente[] = [];
  listaFuncionarias: Funcionaria[] = [];
  listaServicos: Servico[] = [];

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
}
