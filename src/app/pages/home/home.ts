import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  expandNav = false;

  constructor(private router: Router) {}

  toggleNav() {
    this.expandNav = !this.expandNav;
  }
  logout() {
    this.expandNav = false;
    this.router.navigate(['/login']);
  }
}
