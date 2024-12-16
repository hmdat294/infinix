import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PaymentService } from '../../../service/payment.service';
import { CommonModule } from '@angular/common';
import { CurrencyVNDPipe } from '../../../currency-vnd.pipe';
import { SettingService } from '../../../service/setting.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-order',
    imports: [CommonModule, CurrencyVNDPipe, FormsModule],
    templateUrl: './order.component.html',
    styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {


  tabAccordion: string = '';
  user: any;
  orders: any = [];
  startDate: string = '';
  endDate: string = '';
  filteredData: any = [];

  order_status: any = {
    'pending': 'Chờ xử lý',
    'received': 'Đã nhận đơn',
    'delivering': 'Đang giao',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy'
  }

  orderStatusEntries = Object.entries(this.order_status);

  order_color: any = {
    'pending': 'text-system-caution',
    'received': 'text-system-attention',
    'delivered': 'text-system-success',
    'delivering': 'text-system-attention',
    'cancelled': 'text-system-critical'
  }

  payment_methood: any = {
    'cash': 'Trả tiền mặt khi nhận hàng',
    'zalopay': 'Thanh toán qua ZaloPay',
  }

  payment_status: any = {
    'pending': 'Chưa thanh toán',
    'paid': 'Đã thanh toán',
    'refunded': 'Đã hoàn tiền',
    'cancelled': 'Đã hủy'
  }

  payment_color: any = {
    'pending': 'text-system-caution',
    'paid': 'text-system-success',
    'refunded': 'text-system-critical',
    'cancelled': 'text-system-critical'
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

        if (this.user.shop_id > 0) {

          this.paymentService.getOrderByShop(this.user.shop_id).subscribe(
            (res) => {
              this.orders = res.data;
              this.filteredData = [...this.orders];
            });
        }
      });
  }

  filterOrders(): void {

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      this.orders = this.filteredData.filter((order: any) => {
        const createdAt = new Date(order.created_at);
        createdAt.setHours(0, 0, 0, 0);
        return createdAt >= start && createdAt <= end;
      });
    } else this.orders = [...this.filteredData];

  }

  keyword: string = '';
  searchOrder() {
    if (this.keyword && !/^\s*$/.test(this.keyword)) {
      this.orders = this.filteredData.filter((order: any) => {
        const keyword = this.settingService.removeVietnameseTones(this.keyword.toLowerCase().trim());
        const external_order_id = this.settingService.removeVietnameseTones(order.external_order_id.toLowerCase() || "");

        return external_order_id.includes(keyword);
      });
    }
    else this.orders = [...this.filteredData];
  }

  filterOrderStatus(currentStatus: string) {
    const currentIndex = this.orderStatusEntries.findIndex(status => status[0] === currentStatus);
    return this.orderStatusEntries.slice(currentIndex);
  }

  updateStatusOrder(status: string, order_id: number) {
    this.paymentService.updateOrder(status, order_id).subscribe(
      (res) => {
        console.log(res);
      });
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

}
