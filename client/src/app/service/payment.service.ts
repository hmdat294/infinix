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

  //orders
  getOrder(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/order`, { headers });
  }

  postOrder(data: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/order`, data, { headers });
  }

  updateOrder(status: string, order_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/order/${order_id}`, { 'status': status }, { headers });
  }

  getOrderByShop(shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/shop/${shop_id}/orders`, { headers });
  }

  refundOrder(order_id: number, payment_methood: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/${payment_methood}/${order_id}`, {}, { headers });
  }

  //feedback
  getFeedbackByProduct(product_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/product/${product_id}/review`, { headers });
  }

  postFeedback(data: any, product_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/product/${product_id}/review`, data, { headers });
  }

  getFeedbackByShop(shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/shop/${shop_id}/review`, { headers });
  }
}

