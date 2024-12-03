import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';
import { PaymentService } from '../../service/payment.service';

@Component({
  selector: 'app-store-order',
  standalone: true,
  imports: [CurrencyVNDPipe, CommonModule],
  templateUrl: './store-order.component.html',
  styleUrl: './store-order.component.css'
})
export class StoreOrderComponent implements OnInit {
  tabAccordion: string = '';

  orders: any = [];

  order_status: any = {
    'pending': 'Chờ xử lý',
    'received': 'Đã nhận đơn',
    'delivered': 'Đã giao hàng',
    'delivering': 'Đang giao',
    'canceled': 'Đã hủy'
  }

  constructor(
    private settingService: SettingService,
    private paymentService: PaymentService,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {

    this.paymentService.getOrder().subscribe(
      (data: any) => {
        this.orders = data.data;
        console.log(data);
      }
    )
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
}
