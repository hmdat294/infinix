import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVNDPipe } from '../../../currency-vnd.pipe';
import { ShopService } from '../../../service/shop.service';
import { SettingService } from '../../../service/setting.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CurrencyVNDPipe, FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  spaceCheck: any = /^\s*$/;
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

              const arrAddress = this.shop.address.split("|");

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


  
  //create product
  diaLogCreateProduct: boolean = false;
  showDiaLogCreateProduct() {
    this.diaLogCreateProduct = !this.diaLogCreateProduct;
    if (!this.diaLogCreateProduct) {
      this.onCancelProductImg();
      this.category_id_product = 0;
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

  onCancelProductImg() {
    this.selectedFilesProduct = [];
    this.previewProductImages = [];
    if (this.fileProduct) this.fileProduct.nativeElement.value = '';
  }

  removeProductImage(index: number): void {
    this.previewProductImages.splice(index, 1);
    this.selectedFilesProduct.splice(index, 1);
  }

  category_id_product: number = 0;
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
        this.onCancelProductImg();
        this.showDiaLogCreateProduct();

        this.products.push(response.data);
      }
    )
  }


  //update product

  id_product_update: number = 0;
  category_id_product_update: number = 0;
  name_product_update: string = '';
  description_product_update: string = '';
  price_product_update: number = 0;
  discount_product_update: number = 0;
  stock_product_update: number = 1;
  is_active_product_update: string = '0';

  showDiaLogUpdateProduct(product: any) {
    if (product == null) {
      this.id_product_update = 0;
      this.onCancelUpdateProductImg();
    }
    else {
      this.id_product_update = product.id;
      this.previewUpdateProductImages = product.images?.map((media: any) => media.image) || [];
      this.category_id_product_update = product.category_id;
      this.name_product_update = product.name;
      this.description_product_update = product.description;
      this.price_product_update = product.price;
      this.discount_product_update = product.discount;
      this.stock_product_update = product.stock;
      this.is_active_product_update = String(product.is_active);
    }
  }

  selectedFilesUpdateProduct: File[] = [];
  previewUpdateProductImages: string[] = [];
  fileUpdateProduct: any;

  onFileUpdateProductSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files && files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => this.previewUpdateProductImages.push(reader.result as string);
        reader.readAsDataURL(file);
        this.selectedFilesUpdateProduct.push(file);
      });
    }
  }

  onCancelUpdateProductImg() {
    this.selectedFilesUpdateProduct = [];
    this.previewUpdateProductImages = [];
    if (this.fileUpdateProduct) this.fileUpdateProduct.nativeElement.value = '';
  }

  removeUpdateProductImage(index: number): void {
    this.previewUpdateProductImages.splice(index, 1);
    this.selectedFilesUpdateProduct.splice(index, 1);
  }

  updateProduct(value: any) {
    const urlImg = this.previewUpdateProductImages.filter(url => url.startsWith("http"));

    const formData = new FormData();
    formData.append('shop_id', this.user.shop_id);
    formData.append('category_id', value.category_id_product_update);
    formData.append('name', value.name_product_update);
    formData.append('description', value.description_product_update);
    formData.append('price', value.price_product_update);
    formData.append('discount', value.discount_product_update);
    formData.append('stock', value.stock_product_update);
    formData.append('is_active', value.is_active_product_update);

    if (this.selectedFilesUpdateProduct.length > 0)
      this.selectedFilesUpdateProduct.forEach(image => formData.append('images[]', image, image.name));

    if (urlImg.length > 0)
      urlImg.forEach(imagePath => formData.append('urls[]', imagePath));

    this.shopService.updateProduct(formData, this.id_product_update).subscribe(
      (response: any) => {
        const index = this.products.findIndex((product: any) => product.id === this.id_product_update);
        if (index !== -1) this.products[index] = response.data;
        this.showDiaLogUpdateProduct(null);
      }
    )
  }


  //delete product
  id_product_delete: number = 0;

  showDiaLogDeleteProduct(id_product: number) {
    this.id_product_delete = id_product;
  }
  deleteProduct() {
    this.shopService.deleteProduct(this.id_product_delete).subscribe(
      (res) => {
        this.products = this.products.filter((product: any) => product.id !== this.id_product_delete);
        this.originalProducts = [...this.products];
        this.showDiaLogDeleteProduct(0);
      })
  }

  sortProduct(category_id: number) {
    if (category_id > 0) {
      this.products = this.originalProducts.filter(
        (product: any) => product.category_id === Number(category_id)
      );
    } else this.products = [...this.originalProducts];
  }


  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }
}
