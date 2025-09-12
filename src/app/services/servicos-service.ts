import { Injectable } from '@angular/core';
import { Servico } from '../models/servicos';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicosService {
  listaServicosMock: Servico[] = [
    {
      id: 1,
      nome: 'Corte Feminino (lavagem + secagem)',
      valor: 85.0,
    },
    {
      id: 2,
      nome: 'Corte Masculino',
      valor: 45.0,
    },
    {
      id: 3,
      nome: 'Escova Simples',
      valor: 50.0,
    },
    {
      id: 4,
      nome: 'Escova Progressiva',
      valor: 250.0,
    },
    {
      id: 5,
      nome: 'Coloração (raiz)',
      valor: 120.0,
    },
    {
      id: 6,
      nome: 'Manicure (mão)',
      valor: 30.0,
    },
    {
      id: 7,
      nome: 'Pedicure (pé)',
      valor: 40.0,
    },
    {
      id: 8,
      nome: 'Design de Sobrancelha (pinça)',
      valor: 35.0,
    },
    {
      id: 9,
      nome: 'Limpeza de Pele Profunda',
      valor: 150.0,
    },
    {
      id: 10,
      nome: 'Maquiagem Social',
      valor: 180.0,
    },
  ];

  private listaServicosSubject = new BehaviorSubject<Servico[]>(this.listaServicosMock);
  public listaServicos$ = this.listaServicosSubject.asObservable();
}
