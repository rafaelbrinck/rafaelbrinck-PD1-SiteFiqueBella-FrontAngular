import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-cliente.html',
  styleUrl: './form-cliente.css',
})
export class FormCliente implements OnInit {
  @Input() clienteParaEditar: any;

  @Output() save = new EventEmitter<Cliente>();
  @Output() close = new EventEmitter<void>();

  isEditMode = false;
  cliente: Cliente = new Cliente();

  constructor() {}

  ngOnInit() {
    if (this.clienteParaEditar) {
      this.isEditMode = true;
      this.cliente = { ...this.clienteParaEditar };
    }
  }

  onSubmit() {
    this.save.emit(this.cliente);
  }

  onCancel() {
    this.close.emit();
  }
}
