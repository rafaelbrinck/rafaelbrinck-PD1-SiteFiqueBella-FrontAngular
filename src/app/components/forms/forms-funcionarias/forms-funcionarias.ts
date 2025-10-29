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

  @Output() update = new EventEmitter<any>();
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

  onServicoChange(servicoId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.funcionaria.especialidades.push(servicoId);
    } else {
      const index = this.funcionaria.especialidades.indexOf(servicoId);
      if (index > -1) {
        this.funcionaria.especialidades.splice(index, 1);
      }
    }
  }

  isServicoSelecionado(servicoId: string): boolean {
    return this.funcionaria.especialidades.includes(servicoId);
  }

  onSubmit() {
    if (this.isEditMode) {
      this.update.emit(this.funcionaria);
    } else {
      this.save.emit(this.funcionaria);
    }
  }
  onCancel() {
    this.close.emit();
  }
}
