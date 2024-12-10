import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private cart = new BehaviorSubject<any>('Default Value');
  cart$ = this.cart.asObservable();

  updateCart(newValue: any) {
    this.cart.next(newValue);
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8000/api';

  //shop
  getListShop(): Observable<any> {
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
  getCart(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/cart`, { headers });
  }

  addProductToCart(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/cart/add-product`, value, { headers });
  }

  updateProductToCart(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/cart/update-product`, value, { headers });
  }

  removeProductToCart(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/cart/remove-product`, value, { headers });
  }

  //voucher
  getVoucher(voucher_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/voucher/${voucher_id}`, { headers });
  }

  getVoucherByCode(code: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/voucher/bycode/${code}`, { headers });
  }

  getVoucherByShop(shop_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/shop/${shop_id}/vouchers`, { headers });
  }

  postVoucher(value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/voucher`, value, { headers });
  }

  updateVoucher(voucher_id: number, value: any): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/voucher/${voucher_id}`, value, { headers });
  }

  deleteVoucher(voucher_id: number): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.delete(`${this.apiUrl}/voucher/${voucher_id}`, { headers });
  }

  saveVoucher(code: string): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.post(`${this.apiUrl}/voucher/save`, { 'code': code }, { headers });
  }

  getVoucherSaved(): Observable<any> {
    const headers = this.authService.getToken();
    return this.http.get(`${this.apiUrl}/user/saved-vouchers`, { headers });
  }
}
