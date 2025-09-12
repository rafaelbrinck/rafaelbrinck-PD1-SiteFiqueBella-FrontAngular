import { Injectable } from '@angular/core';
import { Servico } from '../models/servicos';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicosService {
  listaServicosMock: Servico[] = [
    { id: 1, nome: 'Corte Feminino', valor: 85.0, cor: '#d946ef' }, // Fúcsia
    { id: 2, nome: 'Corte Masculino', valor: 45.0, cor: '#3b82f6' }, // Azul
    { id: 4, nome: 'Escova Progressiva', valor: 250.0, cor: '#22c55e' }, // Verde
    { id: 5, nome: 'Coloração', valor: 120.0, cor: '#a16207' }, // Âmbar
    { id: 6, nome: 'Manicure', valor: 30.0, cor: '#ec4899' }, // Rosa
    { id: 9, nome: 'Limpeza de Pele', valor: 150.0, cor: '#f97316' }, // Laranja
  ];

  private listaServicosSubject = new BehaviorSubject<Servico[]>(this.listaServicosMock);
  public listaServicos$ = this.listaServicosSubject.asObservable();

  salvarServico(servico: Servico) {
    var lista = this.listaServicosSubject.getValue();
    if (servico.id) {
      const index = lista.findIndex((s) => s.id === servico.id);
      if (index !== -1) {
        lista[index] = servico;
      }
    } else {
      servico.id = lista.length++;
      lista.push(servico);
    }
    this.listaServicosSubject.next(lista);
  }

  deletar(id?: number) {
    if (!id) return;
    var lista = this.listaServicosSubject.getValue();
    var deletar = lista.filter((s) => s.id !== id);
    this.listaServicosSubject.next(deletar);
  }
}
