import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  logadoSubject = new BehaviorSubject(false);
  logado$ = this.logadoSubject.asObservable();

  logar() {
    this.logadoSubject.next(true);
  }
  logout() {
    this.logadoSubject.next(false);
  }
}
