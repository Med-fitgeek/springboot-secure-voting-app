import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
        import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard/create-election',
    canActivate: [authGuard],
    loadComponent: () =>
        import('./features/election/create-election/create-election.component').then(m => m.CreateElectionComponent)
  },
  {
    path: 'dashboard/my-elections',
    canActivate: [authGuard],
    loadComponent: () =>
        import('./features/election/my-elections/my-elections.component').then(m => m.MyElectionsComponent)
  }


];

