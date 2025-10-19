// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Enviroment } from '../enviroments/enviroment';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  message: string;
  session: SupabaseSession;
}

interface SupabaseSession {
  access_token: string;
  user: SupabaseUser;
}

interface SupabaseUser {
  id: string;
  email: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: any;
}

interface DecodedSupabaseToken {
  sub: string;
  email: string;
  exp: number;
}

export interface UsuarioLogado {
  id: string;
  email: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'fiquebella_auth_token';
  private apiUrl = `${Enviroment.apiUrl}/auth`;

  private logadoSubject = new BehaviorSubject<boolean>(false);
  private usuarioAtualSubject = new BehaviorSubject<UsuarioLogado | null>(null);

  public logado$ = this.logadoSubject.asObservable();
  public usuarioAtual$ = this.usuarioAtualSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarSessaoInicial();
  }

  private carregarSessaoInicial(): void {
    const token = this.getToken();
    if (token && this.isTokenValido(token)) {
      const usuario = this.decodificarToken(token);
      this.usuarioAtualSubject.next(usuario);
      this.logadoSubject.next(true);
    } else {
      this.logout();
    }
  }

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap((response) => {
        const token = response.session.access_token;
        if (token) {
          this.salvarSessao(token);
          const usuario = this.decodificarToken(token);
          this.usuarioAtualSubject.next(usuario);
          this.logadoSubject.next(true);
        } else {
          // Lança um erro se a API responder com sucesso mas sem um token
          throw new Error('Token não encontrado na resposta da API.');
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.usuarioAtualSubject.next(null);
    this.logadoSubject.next(false);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValido(token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private isTokenValido(token: string): boolean {
    try {
      const decodedToken: DecodedSupabaseToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  private decodificarToken(token: string): UsuarioLogado | null {
    try {
      const decoded: DecodedSupabaseToken = jwtDecode(token);
      return {
        id: decoded.sub,
        email: decoded.email,
      };
    } catch (error) {
      console.error('Não foi possível decodificar o token:', error);
      return null;
    }
  }

  private salvarSessao(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro na API de autenticação:', error);
    return throwError(() => new Error('Usuário ou senha inválidos.'));
  }
}
