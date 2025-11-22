import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetodoPagamento } from '../models/MetodoPagamento';
import { Enviroment } from '../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class MetodoPagamentoService {
  private apiURL = `${Enviroment.apiUrl}/metodo-pagamento`;

  private listaMetodosPagamentos = new BehaviorSubject<MetodoPagamento[]>([]);
  public listaMetodosPagamentos$ = this.listaMetodosPagamentos.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.carregarMetodosPagamento().subscribe();
  }
  carregarMetodosPagamento(): Observable<MetodoPagamento[]> {
    const headers = this.authService.getHeader();
    if (!headers) {
      return of([]);
    }
    return this.http.get<MetodoPagamento[]>(`${this.apiURL}/list`, { headers: headers }).pipe(
      tap((metodosPagamentosRecebidos) => {
        this.listaMetodosPagamentos.next(metodosPagamentosRecebidos);
      })
    );
  }
}
