import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'agendamentos',
    loadComponent: () => import('./pages/calendario/calendario').then((m) => m.Calendario),
  },
];
