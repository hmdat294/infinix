import { Component, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../service/payment.service';
import { ShopService } from '../service/shop.service';

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
  phone_number: string = '';
  email: string = '';
  address: string = '';

  applied_voucher: string = '';
  message_voucher: string = '';
  discount_voucher: number = 0;
  add_voucher_success: string = '';

  empty_user: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private shopService: ShopService,
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

      } catch (error) {
        this.router.navigate(['/']);
      }
    })
  }

  addVoucher() {
    if (this.applied_voucher == '') {
      this.message_voucher = 'Bạn chưa nhập mã.';
      return;
    }

    this.shopService.getVoucherByCode(this.applied_voucher).subscribe(
      (data) => {
        console.log(data);
        const voucher = data.data;

        this.calculateDays(voucher.valid_from, voucher.valid_until);
        if (voucher.stock == 0 || voucher.is_active == 0) {
          this.message_voucher = 'Mã giảm giá không tồn tại.';
          return;
        }

        if (this.cart.total < voucher.min_price) {
          this.message_voucher = 'Chưa đủ điều kiện dùng mã này.';
          return;
        }

        this.message_voucher = '';
        this.discount_voucher = (this.cart.total * voucher.discount) / 100;
        this.discount_voucher = (this.discount_voucher > voucher.max_discount) ? voucher.max_discount : this.discount_voucher;
        this.cart.applied_voucher = this.applied_voucher;

        this.add_voucher_success =
          `
        Sử dụng <b>${voucher.code}</b> thành công.
        <p>
          <b>Điều kiện: </b>
          Áp dụng cho đơn hàng trên ${this.transformVND(voucher.min_price)} 
          và giảm tối đa ${this.transformVND(voucher.max_discount)}
        </p>
        `;

      },
      (error) => {
        if (error.status === 500)
          this.message_voucher = 'Mã giảm giá không tồn tại.';
      }
    );
  }

  transformVND(value: number): string {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' đ';
  }

  calculateDays(start_date: Date, end_date: Date) {
    const today = new Date();
    const startDate = new Date(start_date);
    const targetDate = new Date(end_date);

    if (today < startDate) {
      const differenceInTime = startDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
      this.message_voucher = `Chưa bắt đầu, còn ${differenceInDays} ngày.`;
      return;
    }

    const differenceInTime = targetDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    if (differenceInDays < 0) {
      this.message_voucher = `Đã hết hạn ${Math.abs(differenceInDays)} ngày.`;
      return;
    }
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
    this.cart.voucher_discount_price = this.discount_voucher;
    this.cart.total = this.cart.total - this.discount_voucher;

    this.cart.shops.forEach((shop: any) => {
      shop.shop_total = 0;
      shop.shop_count = 0;
      shop.products.forEach((product: any) => {
        shop.shop_total += (product.price - (product.price * (product.discount / 100))) * product.pivot.quantity;
      });
      shop.shop_count = shop.products.length;
    });

    console.log(this.cart);

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
