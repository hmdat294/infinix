import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StoreProductComponent } from "./store-product/store-product.component";
import { StoreOrderComponent } from "./store-order/store-order.component";
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-store',
  imports: [CommonModule, StoreProductComponent, StoreOrderComponent, TranslateModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {

  tab_shop: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.tab_shop = params['tab'] || 'tab_product');
  }

  tabShop(tab: string) {
    this.tab_shop = tab;
  }
}
