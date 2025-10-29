import { Component, EventEmitter, Input, OnInit, output, Output } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
@Component({
  selector: 'app-form-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [provideNgxMask()],
  templateUrl: './form-cliente.html',
  styleUrls: ['./form-cliente.css'],
})
export class FormCliente implements OnInit {
  @Input() clienteParaEditar: any;

  @Output() save = new EventEmitter<Cliente>();
  @Output() update = new EventEmitter<Cliente>();
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
    if (this.isEditMode) {
      this.update.emit(this.cliente);
      return;
    }
    this.save.emit(this.cliente);
  }

  onCancel() {
    this.close.emit();
  }
}
