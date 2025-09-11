import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login';
import { CommonModule } from '@angular/common';

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

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginService.logado$.subscribe((logado) => {
      if (!logado) {
        this.showNav = false;
      } else {
        this.showNav = true;
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
