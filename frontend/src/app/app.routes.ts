import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/dashboard/home/home';
import { authGuard } from './core/guards/auth-guard';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Profile } from './profile/profile';
import { QuoteList } from './features/quotes/quote-list/quote-list';
import { MyQuoteList } from './features/quotes/my-quote-list/my-quote-list';
import { CreateQuote } from './features/quotes/create-quote/create-quote';
import { loggedinGuard } from './core/guards/loggedin-guard';
import { Settings } from './features/dashboard/settings/settings';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'register',
    component: Register,
    canActivate: [loggedinGuard]
  },

  {
    path: 'login',
    component: Login,
    canActivate: [loggedinGuard]
  },
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
    {
      path: 'quotes',
      component: QuoteList
    },
    {
      path: 'my-quotes',
      component: MyQuoteList
    },
    {
      path: 'create-quotes',
      component: CreateQuote
    },
    {
      path: 'settings',
      component: Settings
    }
  ]
}
];
