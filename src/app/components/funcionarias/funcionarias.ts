import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FuncionariasService } from '../../services/funcionarias-service';
import { Funcionaria } from '../../models/funcionarias';
import { ServicosService } from '../../services/servicos-service';
import { Servico } from '../../models/servicos';

@Component({
  selector: 'app-funcionarias',
  imports: [CommonModule],
  templateUrl: './funcionarias.html',
  styleUrl: './funcionarias.css',
})
export class Funcionarias implements OnInit {
  listaFuncionarias: Funcionaria[] = [];
  listaServicos: Servico[] = [];

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
}
