import { Injectable } from '@angular/core';
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

  constructor() { }
}
