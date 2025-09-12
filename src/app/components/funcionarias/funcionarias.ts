import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FuncionariasService } from '../../services/funcionarias-service';
import { Funcionaria } from '../../models/funcionarias';
import { ServicosService } from '../../services/servicos-service';
import { Servico } from '../../models/servicos';
import { FormsFuncionarias } from '../forms/forms-funcionarias/forms-funcionarias';

@Component({
  selector: 'app-funcionarias',
  imports: [CommonModule, FormsFuncionarias],
  templateUrl: './funcionarias.html',
  styleUrl: './funcionarias.css',
})
export class Funcionarias implements OnInit {
  listaFuncionarias: Funcionaria[] = [];
  listaServicos: Servico[] = [];

  isModalVisible = false;
  funcionariaSelecionada: Funcionaria | null = null;

  constructor(
    private funcionariasService: FuncionariasService,
    private servicosService: ServicosService
  ) {}

  ngOnInit(): void {
    this.funcionariasService.listaFuncionarias$.subscribe((funcionarias) => {
      this.listaFuncionarias = funcionarias;
    });
    this.servicosService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
  }

  getServicoNome(servicoId: number): string {
    const servico = this.listaServicos.find((s) => s.id === servicoId);
    return servico ? servico.nome! : 'Serviço não encontrado';
  }

  deletar(id: number) {
    this.funcionariasService.deletarFuncionaria(id);
  }

  abrirModalParaNova() {
    this.funcionariaSelecionada = null;
    this.isModalVisible = true;
  }

  abrirModalParaEditar(funcionaria: any) {
    this.funcionariaSelecionada = { ...funcionaria };
    this.isModalVisible = true;
  }

  fecharModal() {
    this.isModalVisible = false;
    this.funcionariaSelecionada = null;
  }

  salvarFuncionaria(funcionaria: Funcionaria) {
    this.funcionariasService.salvarFuncionaria(funcionaria);
    this.fecharModal();
  }
}
