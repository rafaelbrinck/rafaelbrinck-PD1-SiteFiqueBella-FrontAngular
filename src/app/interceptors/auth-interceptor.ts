// src/app/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('[AuthInterceptor] Interceptando requisição para:', request.url);

    if (this.authService.isAuthenticated()) {
      console.log('[AuthInterceptor] Usuário está autenticado. Adicionando token...');
      const token = this.authService.getToken();

      console.log('[AuthInterceptor] Token a ser enviado:', token);

      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(clonedRequest);
    }
    console.warn('[AuthInterceptor] Usuário NÃO está autenticado. Enviando requisição sem token.');
    return next.handle(request);
  }
}
