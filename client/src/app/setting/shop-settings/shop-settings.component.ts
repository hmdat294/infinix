import { Component, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [CurrencyVNDPipe],
  templateUrl: './shop-settings.component.html',
  styleUrl: './shop-settings.component.css'
})
export class ShopSettingsComponent implements OnInit{

  constructor(private settingService: SettingService) {
    
  }

  ngOnInit(): void {
    
  }

  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }
}
