import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StoreProductComponent } from "./store-product/store-product.component";
import { StoreOrderComponent } from "./store-order/store-order.component";
import { StoreInfomationComponent } from "./store-infomation/store-infomation.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, StoreProductComponent, StoreOrderComponent, StoreInfomationComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {

  tab_shop: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.tab_shop = params['tab'] || 'tab_order');
  }

  tabShop(tab: string) {
    this.tab_shop = tab;
  }
}
