import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
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

  spaceCheck: any = /^\s*$/;
  tabAccordion: string = '';
  tab_shop: string = 'tab_category';
  user: any;
  shop: any;
  products: any;

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
        console.log(res);
        this.user = res.data;

        if (this.user.shop_id > 0) {

          this.shopService.getShop(this.user.shop_id).subscribe(
            (res) => {
              console.log(res);
              this.shop = res.data;

              const arrAddress = this.shop.address.split("|");

              this.detail = arrAddress[0];
              this.ward = arrAddress[1];
              this.district = arrAddress[2];
              this.province = arrAddress[3];
            });

          this.shopService.getListProductByShop(this.user.shop_id).subscribe(
            (res) => {
              console.log(res);
              this.products = res.data;
            });
        }
      });
  }

  //shop
  createShop(form: any) {
    const address = [form.detail, form.ward, form.district, form.province].join('|');

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
        console.log(res);
        this.is_update_shop = true;
        this.tabChild('');
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

  //category
  diaLogCreateCategory: boolean = false;
  showDiaLogCreateCategory() {
    this.diaLogCreateCategory = !this.diaLogCreateCategory;
  }

  name_category: string = '';
  createCategory() {
    if (!this.spaceCheck.test(this.name_category)) {

      this.shopService.createCategory(
        {
          'shop_id': this.user.shop_id,
          'name': this.name_category
        }
      ).subscribe(
        (res) => {
          this.diaLogCreateCategory = false;
          this.name_category = '';

          this.shop.categories.push(res.data);
        })
    }
  }


  id_cate_update: number = 0;
  name_cate_update: string = '';
  showDiaLogUpdateCategory(id_cate: number, name_cate: string = '') {
    this.id_cate_update = id_cate;
    this.name_cate_update = name_cate;
  }
  updateCategory() {
    if (!this.spaceCheck.test(this.name_cate_update)) {
      this.shopService.updateCategory(
        { 'name': this.name_cate_update },
        this.id_cate_update
      ).subscribe(
        (res) => {
          this.shop.categories.find((cate: any) => cate.id == res.data.id).name = res.data.name;
          this.showDiaLogUpdateCategory(0, '');
        })
    }
  }


  id_cate_delete: number = 0;
  showDiaLogDeleteCategory(id_cate: number) {
    this.id_cate_delete = id_cate;
  }
  deleteCategory() {
    this.shopService.deleteCategory(this.id_cate_delete).subscribe(
      (res) => {
        this.shop.categories = this.shop.categories.filter((cate: any) => cate.id !== this.id_cate_delete);
        this.showDiaLogDeleteCategory(0);
      })
  }


  //product
  diaLogCreateProduct: boolean = false;
  showDiaLogCreateProduct() {
    this.diaLogCreateProduct = !this.diaLogCreateProduct;
    if (!this.diaLogCreateProduct) {
      this.category_id_product = '';
      this.name_product = '';
      this.description_product = '';
      this.price_product = 0;
      this.discount_product = 0;
      this.stock_product = 1;
      this.is_active_product = '0';
    }
  }


  selectedFilesProduct: File[] = [];
  previewProductImages: string[] = [];
  fileProduct: any;

  onFileProductSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files && files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => this.previewProductImages.push(reader.result as string);
        reader.readAsDataURL(file);
        this.selectedFilesProduct.push(file);
      });
    }
  }

  onCancelPostImg() {
    this.selectedFilesProduct = [];
    this.previewProductImages = [];
    if (this.fileProduct) this.fileProduct.nativeElement.value = '';
  }

  removeProductImage(index: number): void {
    this.previewProductImages.splice(index, 1);
    this.selectedFilesProduct.splice(index, 1);
  }


  category_id_product: string = '';
  name_product: string = '';
  description_product: string = '';
  price_product: number = 0;
  discount_product: number = 0;
  stock_product: number = 1;
  is_active_product: string = '0';









  createProduct(value: any) {

    const formData = new FormData();
    formData.append('shop_id', this.user.shop_id);
    formData.append('category_id', value.category_id_product);
    formData.append('name', value.name_product);
    formData.append('description', value.description_product);
    formData.append('price', value.price_product);
    formData.append('discount', value.discount_product);
    formData.append('stock', value.stock_product);
    formData.append('is_active', value.is_active_product);

    if (this.selectedFilesProduct.length > 0)
      this.selectedFilesProduct.forEach(image => formData.append('images[]', image, image.name));

    this.shopService.createProduct(formData).subscribe(
      (response: any) => {
        console.log(response);
        this.showDiaLogCreateProduct();
      }
    )
  }




  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }

  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }

  tabShop(tab: string) {
    this.tab_shop = this.tab_shop === tab ? '' : tab;
  }
}
