import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('my-project');
  expandNav = false;
  showNav = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.logado$.subscribe((logado) => {
      if (!logado) {
        this.showNav = false;
      } else {
        this.showNav = true;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
