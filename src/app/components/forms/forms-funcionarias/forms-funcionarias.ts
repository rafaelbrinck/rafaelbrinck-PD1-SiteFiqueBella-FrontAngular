import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Servico } from '../../../models/servicos';
import { Funcionaria } from '../../../models/funcionarias';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forms-funcionarias',
  imports: [CommonModule, FormsModule],
  templateUrl: './forms-funcionarias.html',
  styleUrl: './forms-funcionarias.css',
})
export class FormsFuncionarias implements OnInit {
  @Input() funcionariaParaEditar: any;
  @Input() listaDeServicos: Servico[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  isEditMode = false;
  funcionaria: Funcionaria = new Funcionaria();

  constructor() {}

  ngOnInit() {
    if (this.funcionariaParaEditar) {
      this.isEditMode = true;
      this.funcionaria = { ...this.funcionariaParaEditar };
    }
  }

  onServicoChange(servicoId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.funcionaria.servicos_ids.push(servicoId);
    } else {
      const index = this.funcionaria.servicos_ids.indexOf(servicoId);
      if (index > -1) {
        this.funcionaria.servicos_ids.splice(index, 1);
      }
    }
  }

  isServicoSelecionado(servicoId: number): boolean {
    return this.funcionaria.servicos_ids.includes(servicoId);
  }

  onSubmit() {
    this.save.emit(this.funcionaria);
  }

  onCancel() {
    this.close.emit();
  }
}
