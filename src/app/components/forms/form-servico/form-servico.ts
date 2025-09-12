import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servico } from '../../../models/servicos';

@Component({
  selector: 'app-form-servico',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-servico.html',
  styleUrl: './form-servico.css',
})
export class FormServico implements OnInit {
  @Input() servicoParaEditar: Servico | null = null;

  @Output() save = new EventEmitter<Servico>();
  @Output() close = new EventEmitter<void>();

  isEditMode = false;

  servico: Servico = new Servico();

  constructor() {}

  ngOnInit() {
    if (this.servicoParaEditar) {
      this.isEditMode = true;
      this.servico = { ...this.servicoParaEditar };
    }
  }

  onSubmit() {
    this.save.emit(this.servico);
  }

  onCancel() {
    this.close.emit();
  }
}
