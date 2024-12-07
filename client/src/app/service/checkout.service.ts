import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private paymentValue = new BehaviorSubject<any>('Default Value');
  paymentValue$ = this.paymentValue.asObservable();

  updateValue(newValue: any) {
    this.paymentValue.next(newValue);
  }

  constructor(private router: Router) { }

  buyNow(product: any, quantity: number) {
    const data = {
      'total': (product.price - ((product.price * product.discount) / 100)) * quantity,
      'shops': [{
        products: [{
          ...product,
          pivot: {
            quantity: quantity,
            price: product.price,
            product_id: product.id
          }
        }],
        'shop_id': product.shop_id,
        'shop_logo': product.shop_logo,
        'shop_name': product.shop_name,
      }],
      'products_count': 1,
    }

    this.router.navigate(['/checkout', btoa(unescape(encodeURIComponent(JSON.stringify(data))))]);
  }
}
