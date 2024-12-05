import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../service/setting.service';
import { CarouselService } from '../../service/carousel.service';
import { ShopService } from '../../service/shop.service';
import { Router, RouterModule } from '@angular/router';
import { CheckoutService } from '../../service/checkout.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-store-product',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVNDPipe, RouterModule],
  templateUrl: './store-product.component.html',
  styleUrl: './store-product.component.css'
})
export class StoreProductComponent implements OnInit {

  listProduct: any = [];
  products: any = [];
  currentUser: any;
  productDetail_id: number = 0;
  quantity: number = 1;
  content_feedback: string = '';
  keyword: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private settingService: SettingService,
    private carouselService: CarouselService,
    private shopService: ShopService,
    private checkoutService: CheckoutService,
  ) { }

  ngOnInit(): void {
    this.authService.getUser(0).subscribe(
      (data) => {
        this.currentUser = data.data;
        console.log(this.currentUser);
      });

    this.shopService.getListProduct().subscribe(
      (response) => {
        this.products = response.data.filter((product: any) => product.is_active == 1);
        console.log(this.products);

        this.listProduct = [...this.products];
      });
  }


  @ViewChildren('carouselInner') carouselInners!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('nextButton') nextButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('prevButton') prevButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('indicatorsContainer') indicatorsContainers!: QueryList<ElementRef<HTMLDivElement>>;

  ngAfterViewInit(): void {
    this.initCarousels();
  }

  initCarousels(): void {
    const product = this.listProduct.filter((item: any) => item.images.length > 0);

    this.carouselInners.forEach((carouselInner, index) => {
      const nextButton = this.nextButtons.toArray()[index];
      const prevButton = this.prevButtons.toArray()[index];
      const indicators = this.indicatorsContainers.toArray()[index].nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

      this.carouselService.initCarousel(product[index].id, carouselInner, nextButton, prevButton, indicators);
    });
  }


  viewProductDetail(product_id: any) {
    if (product_id == 0) this.quantity = 1;
    this.productDetail_id = product_id;
    this.cdr.detectChanges();
    this.initCarousels();
  }

  addQuantity() {
    this.quantity++;
  }

  reduceQuantity() {
    if (this.quantity > 1) this.quantity--;
  }


  addToCart(product_id: number) {
    console.log({ 'product_id': product_id, 'quantity': this.quantity });

    this.shopService.addProductToCart({ 'product_id': product_id, 'quantity': this.quantity }).subscribe(
      (response) => {
        console.log(response);
        this.shopService.updateCart(response.data);
      })
  }


  buyNow(product_id: number) {
    const product = this.listProduct.find((product: any) => product.id == product_id);
    this.checkoutService.buyNow(product, this.quantity);
  }

  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }

  searchProduct() {
    if (this.keyword && !/^\s*$/.test(this.keyword)) {
      this.listProduct = this.listProduct.filter((product: any) => {
        const keyword = this.settingService.removeVietnameseTones(this.keyword.toLowerCase().trim());
        console.log(keyword);

        const name = this.settingService.removeVietnameseTones(product.name.toLowerCase() || "");

        return name.includes(keyword);
      });
    }
    else this.listProduct = [...this.products];
  }

  resizeTextarea(event: any): void {
    const textarea = event.target;
    if (!textarea.value) {
      textarea.style.height = '32px'; // Chiều cao mặc định khi không có nội dung
    } else if (textarea.scrollHeight < 110) {
      textarea.style.height = 'fit-content';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
