import { Component, OnInit } from '@angular/core';
import { ShopProductComponent } from "./shop-product/shop-product.component";
import { ShopOrderComponent } from "./shop-order/shop-order.component";
import { ShopInfomationComponent } from "./shop-infomation/shop-infomation.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ShopProductComponent, ShopOrderComponent, ShopInfomationComponent, CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  tab_shop: string = 'tab_product';

  constructor() {

  }

  ngOnInit(): void {

  }

  tabShop(tab: string) {
    this.tab_shop = tab;
  }
}
