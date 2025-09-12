import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }
  login() {
    this.authService.login(this.username, this.password).subscribe((success) => {
      if (success) {
        this.router.navigate(['/home']);
      } else {
        alert('Credenciais inválidas. Tente novamente.');
      }
    });
  }
}
