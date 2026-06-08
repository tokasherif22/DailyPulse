import { CanActivateFn } from '@angular/router';
import{ inject } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

export const loggedinGuard: CanActivateFn = (route, state) => {
    const router =
    inject(Router);
  const token = localStorage.getItem('token');

  if(token) { 
      router.navigate(['/dashboard']);
      return false;   // already logged in — block login page
  }

 
  return true; // not logged in — allow access to login page
};
