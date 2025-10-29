import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente-service';
import { CommonModule } from '@angular/common';
import { FormCliente } from '../forms/form-cliente/form-cliente';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormCliente],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  listaClientes: Cliente[] = [];
  isModalVisible = false;
  clienteSelecionado: Cliente | null = null;

  constructor(private clienteService: ClienteService) {
    this.clienteService.carregarClientes().subscribe();
  }

  ngOnInit(): void {
    this.clienteService.listaClientes$.subscribe((clientes) => {
      this.listaClientes = clientes;
    });
  }

  abrirModalParaNovo() {
    this.clienteSelecionado = null;
    this.isModalVisible = true;
  }

  abrirModalParaEditar(cliente: any) {
    this.clienteSelecionado = { ...cliente };
    this.isModalVisible = true;
  }

  fecharModal() {
    this.isModalVisible = false;
    this.clienteSelecionado = null;
  }

  salvarCliente(cliente: Cliente) {
    this.clienteService.cadastrar(cliente);
    this.fecharModal();
  }
  atualizarCliente(cliente: Cliente) {
    this.clienteService.atualizar(cliente);
    this.fecharModal();
  }
  deletar(id: string) {
    this.clienteService.deletar(id);
  }
}
