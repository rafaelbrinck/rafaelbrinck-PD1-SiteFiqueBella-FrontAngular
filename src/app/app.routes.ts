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
  {
    path: 'cadastros',
    loadComponent: () => import('./pages/cadastros/cadastros').then((m) => m.Cadastros),
    canActivate: [AuthGuard],
  },
  {
    path: 'clientes',
    loadComponent: () => import('./components/clientes/clientes').then((m) => m.Clientes),
    canActivate: [AuthGuard],
  },
  {
    path: 'funcionarias',
    loadComponent: () =>
      import('./components/funcionarias/funcionarias').then((m) => m.Funcionarias),
    canActivate: [AuthGuard],
  },
  {
    path: 'servicos',
    loadComponent: () => import('./components/servicos/servicos').then((m) => m.Servicos),
    canActivate: [AuthGuard],
  },
  {
    path: 'estatisticas',
    loadComponent: () =>
      import('./pages/estatisticas/estatisticas').then((m) => m.EstatisticasComponent),
    canActivate: [AuthGuard],
  },
];
