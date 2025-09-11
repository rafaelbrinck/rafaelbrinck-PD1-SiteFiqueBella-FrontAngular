import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private loginService: LoginService) {}
  login() {
    if (
      this.username != '' &&
      this.password != '' &&
      this.username.toLocaleLowerCase() === 'admin' &&
      this.password.toLocaleLowerCase() === 'admin'
    ) {
      this.loginService.logar();
      this.router.navigate(['/home']);
    } else {
      alert('Username/Password está incorreto!');
    }
  }
}
