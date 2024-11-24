import { Component, ElementRef, OnInit } from '@angular/core';
import { ShopService } from '../../../service/shop.service';
import { SettingService } from '../../../service/setting.service';
import { AuthService } from '../../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  spaceCheck: any = /^\s*$/;
  user: any;
  shop: any;
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
              // console.log(this.shop);
              

              const arrAddress = this.shop.address.split("|");

              this.detail = arrAddress[0];
              this.ward = arrAddress[1];
              this.district = arrAddress[2];
              this.province = arrAddress[3];
            });
          }
        });
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

}
