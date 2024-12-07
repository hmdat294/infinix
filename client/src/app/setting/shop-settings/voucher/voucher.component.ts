import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../service/shop.service';
import { SettingService } from '../../../service/setting.service';
import { CurrencyVNDPipe } from '../../../currency-vnd.pipe';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyVNDPipe],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.css'
})
export class VoucherComponent implements OnInit {

  user: any;
  vouchers: any = [];
  products: any = [];
  originalProducts: any[] = [];
  shop: any = [];

  code: string = '';
  discount: number = 0;
  max_discount: number = 0;
  min_price: number = 0;
  usage_limit: number = 0;
  valid_from: string = '';
  valid_until: string = '';
  stock: number = 0;
  is_active: string = '0';
  apply_to_products: any = [];

  constructor(
    private settingService: SettingService,
    private authService: AuthService,
    private shopService: ShopService,
  ) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (res) => {
        this.user = res.data;

        if (this.user.shop_id > 0) {

          this.shopService.getShop(this.user.shop_id).subscribe(
            (res) => this.shop = res.data);

          this.shopService.getListProductByShop(this.user.shop_id).subscribe(
            (res) => {
              this.products = res.data;
              // console.log(this.products);

              this.originalProducts = [...this.products];
            });

          this.shopService.getVoucherByShop(this.user.shop_id).subscribe(
            (res) => {
              this.vouchers = res.data;
              console.log(this.vouchers);
            });
        }
      });
  }

  // shop_id, 
  // code (mã), 
  // discount (giảm giá), 
  // max_discount (số tiền được giảm tối đa), 
  // min_price (số tiền yêu cầu tối thiểu), 
  // usage_limit (lượt sử dụng tối đa,đặt thành -1 nếu muốn sử dụng không giới hạn), 
  // valid_from (ngày có hiệu lực), 
  // valid_until (ngày hết hiệu lực), 
  // stock (số lượng, đặt thành -1 nếu muốn không giới hạn số lượng), 
  // is_active (avtive voucher), 
  // apply_to_products (mảng các id của sản phẩm)

  _discount(method: string) {
    if (method == 'add' && this.discount < 100) this.discount++;
    else if (method == 'reduce' && this.discount > 0) this.discount--;
  }

  _max_discount(method: string) {
    if (method == 'add') this.max_discount++;
    else if (method == 'reduce' && this.max_discount > 0) this.max_discount--;
  }

  _min_price(method: string) {
    if (method == 'add') this.min_price++;
    else if (method == 'reduce' && this.min_price > 0) this.min_price--;
  }

  _usage_limit(method: string) {
    if (method == 'add') this.usage_limit++;
    else if (method == 'reduce' && this.usage_limit > -1) this.usage_limit--;
  }

  _stock(method: string) {
    if (method == 'add') this.stock++;
    else if (method == 'reduce' && this.stock > -1) this.stock--;
  }


  is_dialog_voucher: boolean = false;
  id_update_voucher: number = 0;
  title_voucher: string = 'Thêm';

  showDiaLogVoucher(voucher_id: number = 0) {
    this.is_dialog_voucher = !this.is_dialog_voucher;
    this.id_update_voucher = voucher_id;
    this.title_voucher = 'Thêm';

    if (voucher_id > 0) {
      this.title_voucher = 'Sửa';

      const voucher = this.vouchers.find((item: any) => item.id == voucher_id);

      this.code = voucher.code;
      this.discount = voucher.discount;
      this.max_discount = voucher.max_discount;
      this.min_price = voucher.min_price;
      this.usage_limit = voucher.usage_limit;
      this.valid_from = voucher.valid_from.split(' ')[0];
      this.valid_until = voucher.valid_until.split(' ')[0];
      this.stock = voucher.stock;
      this.is_active = String(voucher.is_active);
      this.apply_to_products = voucher.apply_to_products;

      this.products.forEach((product: any) => {
        if (this.apply_to_products.includes(product.id))
          product.checked = true;
      });
    }

    if (!this.is_dialog_voucher) this.resetValue();
  }

  getCheckedProducts() {
    this.apply_to_products = this.products.filter((item: any) => item.checked).map((item: any) => item.id);
  }

  calculateDays(start_date: Date, end_date: Date) {
    const today = new Date();
    const startDate = new Date(start_date);
    const targetDate = new Date(end_date);

    if (today < startDate) {
      const differenceInTime = startDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
      return `<span class="text-system-caution">Chưa bắt đầu, còn ${differenceInDays} ngày.</span>`;
    }

    const differenceInTime = targetDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    return (differenceInDays > 0)
      ? `<span class="text-system-success">Còn ${differenceInDays} ngày.</span>`
      : `<span class="text-system-critical">Đã hết hạn ${Math.abs(differenceInDays)} ngày.</span>`;
  }


  createVoucher() {
    if (!this.code || !this.valid_from || !this.valid_until || this.apply_to_products.length == 0)
      return;

    const data = {
      'shop_id': this.user.shop_id,
      'code': this.code,
      'discount': this.discount,
      'max_discount': this.max_discount,
      'min_price': this.min_price,
      'usage_limit': this.usage_limit,
      'valid_from': this.valid_from,
      'valid_until': this.valid_until,
      'stock': this.stock,
      'is_active': this.is_active,
      'apply_to_products': this.apply_to_products
    }

    if (this.id_update_voucher > 0) {
      this.shopService.updateVoucher(this.id_update_voucher, data).subscribe(
        (response: any) => {
          console.log(response);

          const voucher = this.vouchers.find((item: any) => item.id == this.id_update_voucher);
          Object.assign(voucher, response.data);

          this.is_dialog_voucher = false;
          this.resetValue();
        });
    }
    else {
      this.shopService.postVoucher(data).subscribe(
        (response: any) => {
          console.log(response);
          this.vouchers.push(response.data);
          this.is_dialog_voucher = false;
          this.resetValue();
        });
    }
  }

  id_delete_voucher: number = 0;
  code_delete_voucher: string = '';
  showDiaLogDeleteVoucher(voucher_id: number, code: string = '') {
    this.id_delete_voucher = voucher_id;
    this.code_delete_voucher = code;
  }

  deleteVoucher() {
    this.shopService.deleteVoucher(this.id_delete_voucher).subscribe(
      (response: any) => {
        console.log(response);
        this.vouchers = this.vouchers.filter((item: any) => item.id != this.id_delete_voucher);
        this.showDiaLogDeleteVoucher(0);
      });
  }

  resetValue() {
    this.code = '';
    this.discount = 0;
    this.max_discount = 0;
    this.min_price = 0;
    this.usage_limit = 0;
    this.valid_from = '';
    this.valid_until = '';
    this.stock = 0;
    this.is_active = '0';
    this.apply_to_products = [];

    this.products.forEach((item: any) => item.checked = false);
    this.keyword = '';
    this.products = [...this.originalProducts];
  }

  sortProduct(category_id: number) {
    if (category_id > 0) {
      this.products = this.originalProducts.filter(
        (product: any) => product.category_id === Number(category_id)
      );
    } else this.products = [...this.originalProducts];
  }

  keyword: string = '';
  searchProduct() {
    if (this.keyword && !/^\s*$/.test(this.keyword)) {
      this.products = this.originalProducts.filter((order: any) => {
        const keyword = this.settingService.removeVietnameseTones(this.keyword.toLowerCase().trim());
        const name = this.settingService.removeVietnameseTones(order.name.toLowerCase() || "");

        return name.includes(keyword);
      });
    } else this.products = [...this.originalProducts];
  }

  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }
}
