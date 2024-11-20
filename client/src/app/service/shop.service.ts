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

  //shop
  getShop(shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/shop/${shop_id}`, { headers });
  }

  createShop(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/shop`, value, { headers });
  }

  updateShop(value: any, shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/shop/${shop_id}`, value, { headers });
  }

  deleteShop(shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/shop/${shop_id}`, { headers });
  }

  //category
  getCategory(category_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/category/${category_id}`, { headers });
  }

  getListCategory(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/category`, { headers });
  }

  createCategory(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/category`, value, { headers });
  }

  updateCategory(value: any, category_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/category/${category_id}`, value, { headers });
  }

  deleteCategory(category_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/category/${category_id}`, { headers });
  }

  //product
  getProduct(product_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/product/${product_id}`, { headers });
  }

  getListProduct(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/product`, { headers });
  }

  getListProductByShop(shop_id:number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/shop/${shop_id}/products`, { headers });
  }

  getListProductByCategory(category_id:number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/category/${category_id}/products`, { headers });
  }

  createProduct(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/product`, value, { headers });
  }

  updateProduct(value: any, product_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/product/${product_id}`, value, { headers });
  }

  deleteProduct(product_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/product/${product_id}`, { headers });
  }
}
