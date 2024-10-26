import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    this.isLoggedIn = !!localStorage.getItem('auth_token');

    return new Observable<boolean>((observer) => {
      if (this.isLoggedIn) {
        this.authService.getUser(0).subscribe(
          (response) => {
            this.isAdmin = !!response.data.permissions[4];

            if (!this.isAdmin && (state.url.startsWith('/admin'))) {
              this.router.navigate(['/']);
              observer.next(false);
              observer.complete();
              return;
            }

            if (state.url === '/landing-page' || state.url === '/login' || state.url === '/register') {
              this.router.navigate(['/']);
              observer.next(false);
              observer.complete();
              return;
            }

            observer.next(true);
            observer.complete();
          },
          (error) => {
            console.error('Error fetching user data', error);
            observer.next(false);
            observer.complete();
          }
        );
      } else {
        if (state.url !== '/landing-page' && state.url !== '/login' && state.url !== '/register') {
          this.router.navigate(['/landing-page']);
          observer.next(false);
        } else {
          observer.next(true);
        }
        observer.complete();
      }
    });
  }
}