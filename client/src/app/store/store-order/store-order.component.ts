import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';
import { PaymentService } from '../../service/payment.service';
import { ShopService } from '../../service/shop.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-store-order',
  imports: [CurrencyVNDPipe, CommonModule, FormsModule, RouterModule],
  templateUrl: './store-order.component.html',
  styleUrl: './store-order.component.css'
})
export class StoreOrderComponent implements OnInit {

  tabAccordion: string = '';
  orders: any = [];
  startDate: string = '';
  endDate: string = '';
  filteredData: any = [];

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

  payment_status: any = {
    'pending': 'Chưa thanh toán',
    'paid': 'Đã thanh toán',
    'refunded': 'Đã hoàn tiền'
  }

  payment_color: any = {
    'pending': 'text-system-caution',
    'paid': 'text-system-success',
    'refunded': 'text-system-critical'
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
        this.filteredData = [...this.orders];

        console.log(data);
      }
    )
  }

  product_feedback: any;
  id_order_feedback: number = 0;
  content_feedback: string = '';
  stars: number[] = [1, 2, 3, 4, 5];
  currentRating: number = 0;

  viewDialogFeedback(product: any, order_id: number) {
    this.product_feedback = product;
    this.id_order_feedback = order_id;
    if (product == null) {
      this.currentRating = 0;
      this.content_feedback = '';
    }
  }

  rate(rating: number): void {
    this.currentRating = rating;
  }

  feedbackProduct() {

    const data = {
      'rating': this.currentRating,
      'content': this.content_feedback
    }

    console.log(data);
    console.log(this.product_feedback.id);


    this.paymentService.postFeedback(data, this.product_feedback.id).subscribe(
      (data: any) => {
        console.log(data);

        const product = this.orders.find((order: any) => order.id == this.id_order_feedback)
          .orders.find((shop: any) => shop.shop_id == this.product_feedback.shop_id)
          .products.find((product: any) => product.id == this.product_feedback.id);
        product.can_review = false;

        this.viewDialogFeedback(null, 0);
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

  refundOrder(order_id: number, payment_methood: string) {
    this.paymentService.refundOrder(order_id, payment_methood).subscribe(
      (data: any) => {
        console.log(data);
      });
  }


  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
}
