import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}
  login() {
    if (
      this.username != '' &&
      this.password != '' &&
      this.username === 'admin' &&
      this.password === 'admin'
    ) {
      this.router.navigate(['/home']);
    } else {
      alert('Username/Password está incorreto!');
    }
  }
}
