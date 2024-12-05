import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PaymentService } from '../../../service/payment.service';
import { CommonModule } from '@angular/common';
import { CurrencyVNDPipe } from '../../../currency-vnd.pipe';
import { SettingService } from '../../../service/setting.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, CurrencyVNDPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  tabAccordion: string = '';
  user: any;
  orders: any = [];

  order_status: any = {
    'pending': 'Chờ xử lý',
    'received': 'Đã nhận đơn',
    'delivered': 'Đã giao hàng',
    'delivering': 'Đang giao',
    'canceled': 'Đã hủy'
  }

  order_color: any = {
    'pending': 'text-system-caution',
    'received': 'text-system-attention',
    'delivered': 'text-system-success',
    'delivering': 'text-system-attention',
    'canceled': 'text-system-critical'
  }

  payment_methood: any = {
    'cash': 'Trả tiền mặt khi nhận hàng',
    'zalopay': 'Thanh toán qua ZaloPay',
  }

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private settingService: SettingService,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (res) => {
        this.user = res.data;
        console.log(this.user);


        if (this.user.shop_id > 0) {

          this.paymentService.getOrderByShop(this.user.shop_id).subscribe(
            (res) => {
              this.orders = res.data;
              console.log(this.orders);
            });
        }
      });
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

}
