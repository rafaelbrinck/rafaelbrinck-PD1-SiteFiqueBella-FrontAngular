import { Component, OnInit } from '@angular/core';
import { ServicosService } from '../../services/servicos-service';
import { Servico } from '../../models/servicos';
import { CommonModule } from '@angular/common';
import { FormServico } from '../forms/form-servico/form-servico';
import { HoraFormatadaPipe } from '../../pipes/hora-formatada-pipe';

@Component({
  selector: 'app-servicos',
  imports: [CommonModule, FormServico, HoraFormatadaPipe],
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

  deletar(id: string) {
    this.servicosService.deletar(id);
  }

  update(servico: Servico) {
    this.servicosService.atualizar(servico);
    this.fecharModal();
  }

  salvarServico(servico: Servico) {
    this.servicosService.cadastrar(servico);
    this.fecharModal();
  }
}
