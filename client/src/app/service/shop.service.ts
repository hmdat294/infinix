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
  getListShop(shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/shop`, { headers });
  }

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
  getListCategory(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/category`, { headers });
  }

  getCategory(category_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/category/${category_id}`, { headers });
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
  getListProductByShop(shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/shop/${shop_id}/products`, { headers });
  }

  getListProductByCategory(category_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/category/${category_id}/products`, { headers });
  }

  getListProduct(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/product`, { headers });
  }

  getProduct(product_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/product/${product_id}`, { headers });
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

  //cart
  getCart(cart_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/cart/${cart_id}`, { headers });
  }

  addProductToCart(value: any, cart_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/cart/${cart_id}/add-product`, value, { headers });
  }

  updateProductToCart(value: any, cart_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/cart/${cart_id}/update-product`, value, { headers });
  }

  removeProductToCart(value: any, cart_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/cart/${cart_id}/remove-product`, value, { headers });
  }
}