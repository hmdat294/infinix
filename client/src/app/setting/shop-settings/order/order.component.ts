import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PaymentService } from '../../../service/payment.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  user: any;
  orders: any;

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService
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

}
