import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) { }

  is_reload: boolean = true;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {

    return new Observable<boolean>((observer) => {
      this.authService.token$.subscribe(auth_token => {
        if (!!auth_token) {
          this.authService.getUser(0).subscribe(
            (response) => {

              const isLogin = this.authService.checkPermissions('can_login', response.data.permissions);

              if (!isLogin) {
                this.authService.removeAuthToken();
                this.is_reload = false;
                observer.next(false);
                observer.complete();
                return;
              }

              this.is_reload = true;

              const isAdmin = this.authService.checkPermissions('can_access_dashboard', response.data.permissions);

              if (!isAdmin && state.url.startsWith('/admin')) {
                this.router.navigate(['/']);
                observer.next(false);
                observer.complete();
                return;
              }

              if (
                state.url === '/landing-page' ||
                state.url === '/login' ||
                state.url === '/register' ||
                state.url === '/forgot-password'
              ) {
                this.router.navigate(['/']);
                observer.next(false);
                observer.complete();
                return;
              }

              observer.next(true);
              observer.complete();

              if (Number(route.paramMap.get('user_id')) === response.data.id) {
                this.router.navigate(['profile']);
                return false;
              } else {
                return true;
              }
            },
            (error) => {
              // localStorage.removeItem('auth_token');
              this.cookieService.delete('auth_token');
              localStorage.removeItem('conversation');
              this.router.navigate(['/landing-page']);
              observer.next(false);
              observer.complete();
            });
        }
        else {
          if (
            state.url !== '/landing-page' &&
            state.url !== '/login' &&
            state.url !== '/register' &&
            state.url !== '/forgot-password'
          ) {
            if (this.is_reload) {
              this.router.navigate(['/landing-page']);
            }

            observer.next(false);
          } else {
            observer.next(true);
          }
          observer.complete();
        }
      });

    });
  }
}