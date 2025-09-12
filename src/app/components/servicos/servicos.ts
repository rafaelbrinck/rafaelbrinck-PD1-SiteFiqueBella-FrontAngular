import { Component, OnInit } from '@angular/core';
import { ServicosService } from '../../services/servicos-service';
import { Servico } from '../../models/servicos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicos',
  imports: [CommonModule],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css',
})
export class Servicos implements OnInit {
  listaServicos: Servico[] = [];

  constructor(private servicosService: ServicosService) {}

  ngOnInit(): void {
    this.servicosService.listaServicos$.subscribe((servicos) => {
      this.listaServicos = servicos;
    });
  }
}
