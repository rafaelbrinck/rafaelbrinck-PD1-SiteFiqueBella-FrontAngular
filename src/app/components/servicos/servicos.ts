import { Component, OnInit } from '@angular/core';
import { ServicosService } from '../../services/servicos-service';
import { Servico } from '../../models/servicos';
import { CommonModule } from '@angular/common';
import { FormServico } from '../forms/form-servico/form-servico';

@Component({
  selector: 'app-servicos',
  imports: [CommonModule, FormServico],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css',
})
export class Servicos implements OnInit {
  listaServicos: Servico[] = [];

  isModalVisible = false;
  servicoSelecionado: Servico | null = null;

  constructor(private servicosService: ServicosService) {}

  ngOnInit(): void {
    this.servicosService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
  }

  abrirModalParaNovo() {
    this.servicoSelecionado = null;
    this.isModalVisible = true;
  }

  abrirModalParaEditar(servico: any) {
    this.servicoSelecionado = { ...servico };
    this.isModalVisible = true;
  }

  fecharModal() {
    this.isModalVisible = false;
    this.servicoSelecionado = null;
  }

  deletar(id: number) {
    this.servicosService.deletar(id);
  }

  salvarServico(servico: Servico) {
    this.servicosService.salvarServico(servico);
    this.fecharModal();
  }
}
