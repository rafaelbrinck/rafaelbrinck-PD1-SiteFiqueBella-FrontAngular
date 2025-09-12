import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  logadoSubject = new BehaviorSubject(false);
  logado$ = this.logadoSubject.asObservable();

  constructor(private authService: AuthService) {}
  logar() {
    this.logadoSubject.next(true);
  }
  logout() {
    this.logadoSubject.next(false);
  }
}
