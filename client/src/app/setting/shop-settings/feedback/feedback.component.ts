import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PaymentService } from '../../../service/payment.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {

  user: any;
  feedbacks: any = [];

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
  ) { }

  stars: number[] = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.authService.getUser(0).subscribe(
      (res) => {
        this.user = res.data;

        if (this.user.shop_id > 0) {

          this.paymentService.getFeedbackByShop(this.user.shop_id).subscribe(
            (res) => {
              this.feedbacks = res.data;
              console.log(this.feedbacks);
            });
        }
      });
  }
}
