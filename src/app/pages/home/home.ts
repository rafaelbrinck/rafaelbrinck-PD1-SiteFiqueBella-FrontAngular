import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  constructor(private router: Router, private loginService: LoginService) {
    this.loginService.logado$.subscribe((logado) => {
      if (!logado) {
        this.router.navigate(['']);
      }
    });
  }
}
