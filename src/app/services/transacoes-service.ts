import { Injectable } from '@angular/core';
import { Enviroment } from '../enviroments/enviroment';
import { BehaviorSubject } from 'rxjs';
import { Transacao } from '../models/Transacao';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class TransacoesService {
  private apiUrl = `${Enviroment.apiUrl}/transacoes`;

  private listaTransacoesSubject = new BehaviorSubject<Transacao[]>([]);
  public listaTransacoes$ = this.listaTransacoesSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  carregarTransacoes(): void {
    const headers = this.authService.getHeader();
    if (!headers) {
      return;
    }
    this.http.get<Transacao[]>(`${this.apiUrl}/list`, { headers: headers }).subscribe({
      next: (transacoesRecebidas) => {
        this.listaTransacoesSubject.next(transacoesRecebidas);
      },
      error: (error) => {
        console.error('Erro ao carregar transações:', error);
      },
    });
  }

  cadastrar(transacao: Transacao): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    this.http.post<Transacao>(`${this.apiUrl}/insert`, transacao, { headers: headers }).subscribe({
      next: (transacaoCadastrada) => {
        const listaAtual = this.listaTransacoesSubject.getValue();
        this.listaTransacoesSubject.next([...listaAtual, transacaoCadastrada]);
      },
      error: (error) => {
        console.error('Erro ao cadastrar transação:', error);
      },
    });
    return true;
  }
}
