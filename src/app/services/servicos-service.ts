import { Injectable } from '@angular/core';
import { Servico } from '../models/servicos';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { Enviroment } from '../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class ServicosService {
  private apiUrl = `${Enviroment.apiUrl}/servicos`;

  private listaServicosSubject = new BehaviorSubject<Servico[]>([]);
  public listaServicos$ = this.listaServicosSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.carregarServicos().subscribe();
  }

  carregarServicos(): Observable<Servico[]> {
    const headers = this.authService.getHeader();
    if (!headers) {
      return of([]);
    }
    return this.http.get<Servico[]>(`${this.apiUrl}/list`, { headers: headers }).pipe(
      tap((servicosRecebidos) => {
        this.listaServicosSubject.next(servicosRecebidos);
      }),
      catchError(this.handleError)
    );
  }

  cadastrar(servico: Servico): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    this.http.post<Servico>(`${this.apiUrl}/insert`, servico, { headers: headers }).subscribe({
      next: (servicoCadastrado) => {
        const listaAtual = this.listaServicosSubject.getValue();
        this.listaServicosSubject.next([...listaAtual, servicoCadastrado]);
      },
      error: (error) => {
        console.error('Erro ao cadastrar serviço:', error);
      },
    });
    return true;
  }

  atualizar(servico: Servico): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    servico.updated_at = new Date();
    this.http
      .put<Servico>(`${this.apiUrl}/update/${servico.servico_id}`, servico, { headers: headers })
      .subscribe({
        next: (servicoAtualizado) => {
          this.carregarServicos().subscribe();
        },
        error: (error) => {
          console.error('Erro ao atualizar serviço:', error);
        },
      });
    return true;
  }

  deletar(id?: string) {
    const headers = this.authService.getHeader();
    if (!headers || !id) {
      return false;
    }
    this.http.delete(`${this.apiUrl}/remove/${id}`, { headers: headers }).subscribe({
      next: () => {
        this.carregarServicos().subscribe();
      },
      error: (error) => {
        console.error('Erro ao deletar serviço:', error);
      },
    });
    return true;
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no ClienteService:', error);
    return throwError(() => new Error('Algo deu errado no serviço de clientes.'));
  }
}
