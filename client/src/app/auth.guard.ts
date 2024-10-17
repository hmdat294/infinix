import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('auth_token');

    if (token) {
      if (state.url === '/landing-page' || state.url === '/login' || state.url === '/register') {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } else {
      if (state.url != '/landing-page' && state.url != '/login' && state.url != '/register') {
        this.router.navigate(['/landing-page']);
        return false;
      }
      return true;
    }
  }
}
