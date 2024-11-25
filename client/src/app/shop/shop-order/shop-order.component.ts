import { Component } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';

@Component({
  selector: 'app-shop-order',
  standalone: true,
  imports: [CurrencyVNDPipe],
  templateUrl: './shop-order.component.html',
  styleUrl: './shop-order.component.css'
})
export class ShopOrderComponent {

}
