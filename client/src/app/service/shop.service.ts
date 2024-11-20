import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {


  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8000/api';

  createShop(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/shop`, value, { headers });
  }
}
