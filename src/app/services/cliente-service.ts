import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  listaClientesMock: Cliente[] = [
    {
      id: 1,
      nome: 'Ana',
      sobrenome: 'Silva',
      telefone: '(51) 98877-6655',
      email: 'ana.silva@example.com',
      data_nascimento: '1995-03-15',
    },
    {
      id: 2,
      nome: 'Bruno',
      sobrenome: 'Santos',
      telefone: '(11) 99988-7766',
      email: 'bruno.santos@email.com',
      data_nascimento: '1988-11-20',
    },
    {
      id: 3,
      nome: 'Carla',
      sobrenome: 'Oliveira',
      telefone: '(21) 98765-4321',
      email: 'carla.o@mail.com',
      data_nascimento: '2001-07-08',
    },
    {
      id: 4,
      nome: 'Daniel',
      sobrenome: 'Souza',
      telefone: '(51) 98123-4567',
      email: 'daniel.souza@example.com',
      data_nascimento: '1992-09-01',
    },
    {
      id: 5,
      nome: 'Eduarda',
      sobrenome: 'Pereira',
      telefone: '(48) 99654-3210',
      email: 'duda.pereira@email.com',
      data_nascimento: '1999-05-25',
    },
    {
      id: 6,
      nome: 'Felipe',
      sobrenome: 'Costa',
      telefone: '(51) 98555-1234',
      email: 'felipe.costa@example.com',
      data_nascimento: '1985-01-30',
    },
    {
      id: 7,
      nome: 'Gabriela',
      sobrenome: 'Martins',
      telefone: '(11) 99876-5432',
      email: 'gabi.martins@mail.com',
      data_nascimento: '1998-08-12',
    },
    {
      id: 8,
      nome: 'Heitor',
      sobrenome: 'Alves',
      telefone: '(51) 98222-3344',
      email: 'heitor.alves@example.com',
      data_nascimento: '1979-12-07',
    },
    {
      id: 9,
      nome: 'Isabela',
      sobrenome: 'Ribeiro',
      telefone: '(21) 98888-9999',
      email: 'isabela.r@email.com',
      data_nascimento: '2003-02-18',
    },
    {
      id: 10,
      nome: 'João',
      sobrenome: 'Carvalho',
      telefone: '(51) 99111-2222',
      email: 'joao.carvalho@example.com',
      data_nascimento: '1990-10-10',
    },
  ];

  private listaclientesSubject = new BehaviorSubject<Cliente[]>(this.listaClientesMock);
  public listaClientes$ = this.listaclientesSubject.asObservable();

  salvarCliente(cliente: Cliente) {
    var lista = this.listaclientesSubject.getValue();
    if (cliente.id) {
      const index = lista.findIndex((f) => f.id === cliente.id);
      if (index !== -1) {
        lista[index] = cliente;
      }
    } else {
      cliente.id = lista.length++;
      lista.push(cliente);
    }
    this.listaclientesSubject.next(lista);
  }

  deletar(id?: number) {
    if (!id) return;
    var lista = this.listaclientesSubject.getValue();
    var deletar = lista.filter((c) => c.id !== id);
    this.listaclientesSubject.next(deletar);
  }
}
