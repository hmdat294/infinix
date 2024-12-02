import { Component, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../service/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyVNDPipe, CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  product_order: any = [1];
  payment_method: string = 'cash';
  change_address: number = 0;
  cart: any = [];
  currentUser: any;

  name: string = '';
  phone_number: string = "";
  email: string = "";
  address: string = "";

  empty_user: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private paymentSrevice: PaymentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      try {
        if (!params['data']) throw new Error('No data in params');

        this.authService.getUser(0).subscribe(
          (data) => {
            this.currentUser = data.data;
          });

        this.cart = JSON.parse(decodeURIComponent(escape(atob(params['data']))));
        console.log(this.cart);


      } catch (error) {
        this.router.navigate(['/']);
      }
    })
  }

  payment() {

    if (this.change_address == 2)
      this.cart.user = {
        "name": this.name,
        "phone_number": this.phone_number,
        "email": this.email,
        "address": this.address,
      }
    else
      this.cart.user = {
        "name": this.currentUser?.profile.display_name,
        "phone_number": this.currentUser?.phone_number,
        "email": this.currentUser?.email,
        "address": this.currentUser?.profile.address,
      }

    this.cart.payment_method = this.payment_method;

    this.cart.shops.forEach((shop: any) => {
      shop.shop_total = 0;
      shop.shop_count = 0;
      shop.products.forEach((product: any) => {
        shop.shop_total += (product.price - (product.price * (product.discount / 100))) * product.pivot.quantity;
      });
      shop.shop_count = shop.products.length;
    });

    if (Object.values(this.cart.user).some(value => value === null || value === undefined || value === '')) {
      this.empty_user = true;
      return;
    }
    else {
      this.empty_user = false;
      console.log(JSON.stringify(this.cart));

      this.paymentSrevice.postOrder({ 'order': JSON.stringify(this.cart) }).subscribe(
        (data) => {
          console.log(data);
          if (data.order_url)
            window.location.href = data.order_url;
        });

    }
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
