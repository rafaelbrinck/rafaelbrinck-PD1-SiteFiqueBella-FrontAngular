import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
interface AuthSession {
  token: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'fiquebella_auth_session';

  private logadoSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public logado$ = this.logadoSubject.asObservable();

  constructor() {}

  login(username: string, password: string): Observable<boolean> {
    const isValidUser =
      username.toLocaleLowerCase() === 'admin' && password.toLocaleLowerCase() === 'admin';
    if (!isValidUser) {
      return of(false);
    }
    return of(true).pipe(
      delay(500),
      tap(() => {
        this.sessaoFake();
        this.logadoSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.logadoSubject.next(false);
  }

  isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) {
      return false;
    }
    return session.expiresAt > Date.now();
  }

  private sessaoFake(): void {
    const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hora
    const expirateAt = Date.now() + expirationTime;
    const fakeToken = `fake-token-${Date.now()}`;

    const session: AuthSession = {
      token: fakeToken,
      expiresAt: expirateAt,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
  }

  private getSession(): AuthSession | null {
    const sessionString = localStorage.getItem(this.STORAGE_KEY);
    if (!sessionString) {
      return null;
    }
    return JSON.parse(sessionString) as AuthSession;
  }
}
