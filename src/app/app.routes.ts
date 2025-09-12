import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [AuthGuard],
  },
  {
    path: 'agendamentos',
    loadComponent: () => import('./pages/calendario/calendario').then((m) => m.Calendario),
    canActivate: [AuthGuard],
  },
];
