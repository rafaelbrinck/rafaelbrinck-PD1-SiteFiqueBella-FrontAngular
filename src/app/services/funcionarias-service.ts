import { Injectable } from '@angular/core';
import { Funcionaria } from '../models/funcionarias';
import { BehaviorSubject } from 'rxjs';
import { ServicosService } from './servicos-service';

@Injectable({
  providedIn: 'root',
})
export class FuncionariasService {
  listaFuncionariasMock = [
    {
      id: 1,
      nome: 'Juliana',
      sobrenome: 'Almeida',
      email: 'juliana.a@fiquebella.com',
      telefone: '(51) 98811-2233',
      servicos_ids: [1, 4, 5],
    },
    {
      id: 2,
      nome: 'Beatriz',
      sobrenome: 'Gonçalves',
      email: 'beatriz.g@fiquebella.com',
      telefone: '(51) 99922-3344',
      servicos_ids: [6, 9],
    },
    {
      id: 3,
      nome: 'Roberto',
      sobrenome: 'Mendes',
      email: 'roberto.m@fiquebella.com',
      telefone: '(51) 98765-9876',
      servicos_ids: [2],
    },
    {
      id: 4,
      nome: 'Vanessa',
      sobrenome: 'Lima',
      email: 'vanessa.l@fiquebella.com',
      telefone: '(51) 99123-1234',
      servicos_ids: [4, 9, 1],
    },
  ];

  private listaFuncionariasSubject = new BehaviorSubject<Funcionaria[]>(this.listaFuncionariasMock);
  public listaFuncionarias$ = this.listaFuncionariasSubject.asObservable();

  deletarFuncionaria(id: number) {
    var lista = this.listaFuncionariasSubject.getValue();
    var deletar = lista.filter((f) => f.id !== id);
    this.listaFuncionariasSubject.next(deletar);
  }

  salvarFuncionaria(funcionaria: Funcionaria) {
    const lista = this.listaFuncionariasSubject.getValue();
    if (funcionaria.id) {
      const index = lista.findIndex((f) => f.id === funcionaria.id);
      if (index !== -1) {
        lista[index] = funcionaria;
      }
    } else {
      funcionaria.id = lista.length++;
      lista.push(funcionaria);
    }
    this.listaFuncionariasSubject.next(lista);
  }
}
