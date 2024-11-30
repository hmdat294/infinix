import { Component, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyVNDPipe, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  product_order: any = [1];
  payment_method: string = '';
  change_address: number = 0;
  cart: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      try {
        if (!params['data']) {
          throw new Error('No data in params');
        }

        this.cart = JSON.parse(decodeURIComponent(escape(atob(params['data']))));
        console.log(this.cart);


      } catch (error) {
        this.router.navigate(['/']);
      }
    })
  }

  setChangeAddress(value: number) {
    this.change_address = value;
  }

  setPaymentMethod(value: string) {
    this.payment_method = value;
  }

  resizeTextarea(event: any): void {
    const textarea = event.target;
    if (!textarea.value) {
      textarea.style.height = '32px'; // Chiều cao mặc định khi không có nội dung
    } else if (textarea.scrollHeight < 110) {
      textarea.style.height = 'fit-content';
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '110px';
      textarea.style.overflowY = 'auto';
    }
  }

}
