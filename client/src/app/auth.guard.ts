import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const token = localStorage.getItem('auth_token');

    if (token) {
      // Nếu có token, cho phép truy cập route
      return true;
    } else {
      // Nếu không có token, chuyển hướng về trang login
      this.router.navigate(['/login']);
      return false;
    }
  }
}