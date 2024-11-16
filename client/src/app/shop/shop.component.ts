import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { SettingService } from '../service/setting.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVNDPipe],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  text: string = 'Quần short nam Choice HT15 chất cotton Basic thể thao phong cách Hàn Quốc';
  productId: number = 0;

  constructor(
    private settingService: SettingService,
  ) { }

  ngOnInit(): void {

  }

  showDiaLogDetailProduct(product: any) {
    if (product == null) {
      this.productId = 0;
    }
    else {
      this.productId = product.id;
    }
    console.log(this.productId);
  }

  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }
}
