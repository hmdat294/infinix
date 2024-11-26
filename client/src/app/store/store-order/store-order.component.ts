import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';

@Component({
  selector: 'app-store-order',
  standalone: true,
  imports: [CurrencyVNDPipe, CommonModule],
  templateUrl: './store-order.component.html',
  styleUrl: './store-order.component.css'
})
export class StoreOrderComponent implements OnInit {
  tabAccordion: string = '';

  orders:any = [1, 2, 3, 4, 5];
  product_order:any = [1, 2];

  constructor(
    private settingService: SettingService,
    private el: ElementRef,
  ) {
  }
  
  ngOnInit(): void {
      
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
}
