import { Component, ElementRef, OnInit } from '@angular/core';
import { SettingService } from '../../service/setting.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ShopService } from '../../service/shop.service';
import { AuthService } from '../../service/auth.service';
import { CategoryComponent } from "./category/category.component";
import { ProductComponent } from "./product/product.component";
import { OrderComponent } from "./order/order.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [FormsModule, CommonModule, CategoryComponent, ProductComponent, OrderComponent, FeedbackComponent, TranslateModule],
  templateUrl: './shop-settings.component.html',
  styleUrl: './shop-settings.component.css'
})
export class ShopSettingsComponent implements OnInit {

  spaceCheck: any = /^\s*$/;
  tabAccordion: string = '';
  tab_shop: string = 'tab_category';
  user: any;
  shop: any;
  products: any;
  originalProducts: any[] = [];
  province: string = '';
  district: string = '';
  ward: string = '';
  detail: string = '';

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
        this.user = res.data;

        if (this.user.shop_id > 0) {

          this.shopService.getShop(this.user.shop_id).subscribe(
            (res) => {
              this.shop = res.data;

              const arrAddress = this.shop.address?.split(" | ");

              this.detail = arrAddress[0];
              this.ward = arrAddress[1];
              this.district = arrAddress[2];
              this.province = arrAddress[3];
            });

          this.shopService.getListProductByShop(this.user.shop_id).subscribe(
            (res) => {
              this.products = res.data;
              this.originalProducts = [...this.products];
            });
        }
      });
  }

  //shop
  createShop(form: any) {
    const address = [form.detail, form.ward, form.district, form.province].join(' | ');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('phone_number', form.phone_number);
    formData.append('address', address);

    if (this.selectedFilesLogo.length > 0)
      formData.append('logo', this.selectedFilesLogo[0], this.selectedFilesLogo[0].name);

    this.shopService.createShop(formData).subscribe(
      (res) => {
        this.user.shop_id = res.data.id;
        this.tabChild('');
      }
    )
  }


  is_update_shop: boolean = true;
  updateShop(form: any) {
    const address = [form.detail, form.ward, form.district, form.province].join('|');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('phone_number', form.phone_number);
    formData.append('address', address);

    if (this.selectedFilesUpdateLogo.length > 0)
      formData.append('logo', this.selectedFilesUpdateLogo[0], this.selectedFilesUpdateLogo[0].name);

    this.shopService.updateShop(formData, this.user.shop_id).subscribe(
      (res) => {
        this.is_update_shop = true;
        this.tabChild('');
      }
    )
  }

  is_delete_shop: boolean = false;
  deleteShop() {
    this.shopService.deleteShop(this.user.shop_id).subscribe(
      (res) => {
        this.user.shop_id = null;
        this.tabChild('');
        this.is_delete_shop = false;
      });
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

  fileUpdateLogo: any;
  selectedFilesUpdateLogo: File[] = [];
  previewUpdateLogo: string[] = [];

  onFileUpdateLogoSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewUpdateLogo = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesUpdateLogo = [file];
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  tabShop(tab: string) {
    this.tab_shop = this.tab_shop === tab ? '' : tab;
  }
}
