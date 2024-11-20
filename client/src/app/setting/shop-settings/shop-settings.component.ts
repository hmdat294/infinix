import { Component, ElementRef, OnInit } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../service/shop.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [CurrencyVNDPipe, FormsModule, CommonModule],
  templateUrl: './shop-settings.component.html',
  styleUrl: './shop-settings.component.css'
})
export class ShopSettingsComponent implements OnInit {

  tabAccordion: string = '';
  user:any;

  constructor(
    private settingService: SettingService,
    private shopService: ShopService,
    private authService: AuthService,
    private el: ElementRef,
  ) {

  }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (res) => {
        console.log(res);
        this.user = res.data;
      }
    )

  }

  createShop(form: any) {

    const address = [form.detail, form.ward, form.district, form.province].join('/');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('phone_number', form.phone_number);
    formData.append('address', address);

    if (this.selectedFilesLogo.length > 0)
      formData.append('logo', this.selectedFilesLogo[0], this.selectedFilesLogo[0].name);

    this.shopService.createShop(formData).subscribe(
      (res) => {
        console.log(res);
      }
    )
  }

  fileLogo: any;
  selectedFilesLogo: File[] = [];
  previewLogo: string[] = [];

  onFileLogoSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewLogo = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesLogo = [file];

  }


  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
}
