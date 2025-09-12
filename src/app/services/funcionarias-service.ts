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
      servicos_ids: [1, 3, 4, 5],
    },
    {
      id: 2,
      nome: 'Beatriz',
      sobrenome: 'Gonçalves',
      email: 'beatriz.g@fiquebella.com',
      telefone: '(51) 99922-3344',
      servicos_ids: [6, 7],
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
      servicos_ids: [8, 9, 10],
    },
  ];

  private listaFuncionariasSubject = new BehaviorSubject<Funcionaria[]>(this.listaFuncionariasMock);
  public listaFuncionarias$ = this.listaFuncionariasSubject.asObservable();
}
