import { Component, ElementRef, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-order',
  standalone: true,
  imports: [CurrencyVNDPipe, CommonModule],
  templateUrl: './shop-order.component.html',
  styleUrl: './shop-order.component.css'
})
export class ShopOrderComponent implements OnInit {
  tabAccordion: string = '';

  orders:any = [1, 2, 3, 4, 5];

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
