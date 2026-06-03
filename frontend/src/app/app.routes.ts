import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/dashboard/home/home';
import { authGuard } from './core/guards/auth-guard';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Profile } from './profile/profile';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'login',
    component: Login
  },

  // {
  //   path: 'dashboard',
  //   component: Home,
  //   canActivate: [authGuard]
  // }
  {
  path: '',
  component: DashboardLayout,
  canActivate: [authGuard],
  children: [

    {
      path: 'dashboard',
      component: Home
    },

    {
      path: 'profile',
      component: Profile
    },

    // {
    //   path: 'quotes',
    //   component: QuotesComponent
    // }
  ]
}
];
