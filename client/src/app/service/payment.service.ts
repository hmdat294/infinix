import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8000/api';

  paymentVnpay(data: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/vnpay-payment`, data, { headers });
  }

  paymentZalopay(data: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/zalopay-payment`, data, { headers });
  }

  getOrder(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/order`, { headers });
  }

  postOrder(data: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/order`, data, { headers });
  }
}

