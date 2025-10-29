import { Injectable } from '@angular/core';

import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { Enviroment } from '../enviroments/enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from '../models/cliente';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = `${Enviroment.apiUrl}/clientes`;

  private listaclientesSubject = new BehaviorSubject<Cliente[]>([]);
  public listaClientes$ = this.listaclientesSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.carregarClientes().subscribe();
  }

  carregarClientes(): Observable<Cliente[]> {
    const headers = this.authService.getHeader();
    if (!headers) {
      return of([]);
    }
    return this.http.get<Cliente[]>(`${this.apiUrl}/list`, { headers: headers }).pipe(
      tap((clientesRecebidos) => {
        this.listaclientesSubject.next(clientesRecebidos);
      }),
      catchError(this.handleError)
    );
  }

  cadastrar(cliente: Cliente): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    this.http.post<Cliente>(`${this.apiUrl}/insert`, cliente, { headers: headers }).subscribe({
      next: (clienteCadastrado) => {
        const listaAtual = this.listaclientesSubject.getValue();
        this.listaclientesSubject.next([...listaAtual, clienteCadastrado]);
      },
      error: (error) => {
        console.error('Erro ao cadastrar cliente:', error);
      },
    });
    return true;
  }

  atualizar(cliente: Cliente): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    cliente.updated_at = new Date();
    this.http
      .put<Cliente>(`${this.apiUrl}/update/${cliente.cliente_id}`, cliente, { headers: headers })
      .subscribe({
        next: (clienteAtualizado) => {
          this.carregarClientes().subscribe();
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
        },
      });
    return true;
  }

  deletar(id?: string): boolean {
    const headers = this.authService.getHeader();
    if (!headers || !id) {
      return false;
    }
    this.http.delete<void>(`${this.apiUrl}/remove/${id}`, { headers: headers }).subscribe({
      next: () => {
        const listaAtual = this.listaclientesSubject.getValue();
        const listaAtualizada = listaAtual.filter((cliente) => cliente.cliente_id !== id);
        this.listaclientesSubject.next(listaAtualizada);
      },
      error: (error) => {
        console.error('Erro ao deletar cliente:', error);
      },
    });

    return true;
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no ClienteService:', error);
    return throwError(() => new Error('Algo deu errado no serviço de clientes.'));
  }
}
