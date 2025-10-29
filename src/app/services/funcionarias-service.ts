import { Injectable } from '@angular/core';
import { Funcionaria } from '../models/funcionarias';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { ServicosService } from './servicos-service';
import { Enviroment } from '../enviroments/enviroment';
import { AuthService } from './auth-service';
import { HttpClient } from '@angular/common/http';
import { Servico } from '../models/servicos';

@Injectable({
  providedIn: 'root',
})
export class FuncionariasService {
  private apiUrl = `${Enviroment.apiUrl}/funcionarios`;

  private listaFuncionariasSubject = new BehaviorSubject<Funcionaria[]>([]);
  public listaFuncionarias$ = this.listaFuncionariasSubject.asObservable();

  constructor(
    private authService: AuthService,
    private servicosService: ServicosService,
    private http: HttpClient
  ) {
    this.carregarFuncionarias().subscribe();
  }

  carregarFuncionarias(): Observable<Funcionaria[]> {
    const headers = this.authService.getHeader();
    if (!headers) {
      return of([]);
    }
    return this.http.get<Funcionaria[]>(`${this.apiUrl}/list`, { headers: headers }).pipe(
      tap((funcionariasRecebidas) => {
        funcionariasRecebidas.forEach((funcionaria) => {
          let listaServicos: Servico[] = [];
          this.servicosService.listaServicos$.subscribe((listaServicos) => {
            listaServicos = listaServicos;
          });
          let servicosFuncionaria: Servico[] = [];
          funcionaria.especialidades.forEach((id) => {
            const servico = listaServicos.find((s) => s.servico_id === id);
            servicosFuncionaria.push(servico!);
          });
        });
        this.listaFuncionariasSubject.next(funcionariasRecebidas);
      }),
      catchError(this.handleError)
    );
  }

  deletarFuncionaria(id: string) {
    const headers = this.authService.getHeader();
    if (!headers) {
      return;
    }
    this.http.delete(`${this.apiUrl}/remove/${id}`, { headers: headers }).subscribe({
      next: () => {
        const listaAtual = this.listaFuncionariasSubject.getValue();
        const listaAtualizada = listaAtual.filter((f) => f.funcionario_id !== id);
        this.listaFuncionariasSubject.next(listaAtualizada);
      },
      error: (error) => {
        console.error('Erro ao deletar funcionária:', error);
      },
    });
    return;
  }

  salvarFuncionaria(funcionaria: Funcionaria): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    this.http
      .post<Funcionaria>(`${this.apiUrl}/insert`, funcionaria, { headers: headers })
      .subscribe({
        next: (funcionariaCadastrada) => {
          const listaAtual = this.listaFuncionariasSubject.getValue();
          this.listaFuncionariasSubject.next([...listaAtual, funcionariaCadastrada]);
        },
        error: (error) => {
          console.error('Erro ao cadastrar funcionária:', error);
        },
      });
    return true;
  }

  update(funcionaria: Funcionaria): boolean {
    const headers = this.authService.getHeader();
    if (!headers) {
      return false;
    }
    funcionaria.updated_at = new Date();
    this.http
      .put<Funcionaria>(`${this.apiUrl}/update/${funcionaria.funcionario_id}`, funcionaria, {
        headers: headers,
      })
      .subscribe({
        next: (funcionariaAtualizada) => {
          this.carregarFuncionarias().subscribe();
        },
        error: (error) => {
          console.error('Erro ao atualizar funcionária:', error);
        },
      });
    return true;
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no ClienteService:', error);
    return throwError(() => new Error('Algo deu errado no serviço de clientes.'));
  }
}
