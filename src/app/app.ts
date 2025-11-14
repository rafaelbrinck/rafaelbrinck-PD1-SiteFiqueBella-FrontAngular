import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';
import { Loader } from './services/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  expandNav = false;
  showNav = false;

  constructor(public authService: AuthService, private router: Router, private loader: Loader) {}

  ngOnInit(): void {
    const validaSessao: boolean = this.authService.isAuthenticated();
    if (!validaSessao) {
      this.authService.logout();
    }
    this.authService.logado$.subscribe((logado) => {
      if (!logado) {
        this.showNav = false;
      } else {
        this.showNav = true;
        this.loader.carregarDados();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
