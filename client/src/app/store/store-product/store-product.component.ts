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
import { PaymentService } from '../../service/payment.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-store-product',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVNDPipe, RouterModule, TranslateModule],
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
  feedbacks: any = [];
  cart: any = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private settingService: SettingService,
    private carouselService: CarouselService,
    private shopService: ShopService,
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
  ) { }

  ngOnInit(): void {
    this.authService.getUser(0).subscribe(data => this.currentUser = data.data);

    this.shopService.getListProduct().subscribe(
      (response) => {
        this.products = response.data.filter((product: any) => product.is_active == 1);
        console.log(this.products);

        this.listProduct = [...this.products];
      });


    this.shopService.getCart().subscribe(
      (data) => this.cart = data.data);

    this.shopService.cart$.subscribe(cart => {
      this.cart = cart;

      if (this.productDetail_id > 0)
        this.product_cart_quantity = this.cart.products.find((product: any) => product.id == this.productDetail_id)?.pivot.quantity || 0;

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

  stars: number[] = [1, 2, 3, 4, 5];
  product_cart_quantity: number = 0;
  max_quantity: number = 0;

  viewProductDetail(product_id: any, max: number = 1) {
    if (product_id == 0) this.quantity = 1;
    this.productDetail_id = product_id;
    this.max_quantity = max;
    this.cdr.detectChanges();
    this.initCarousels();

    if (product_id > 0) {
      this.product_cart_quantity = this.cart.products.find((product: any) => product.id == product_id)?.pivot.quantity || 0;

      this.paymentService.getFeedbackByProduct(product_id).subscribe(
        (response) => {
          this.feedbacks = response.data;
        });
    }
  }

  roundToNearest(value: number): number {
    return Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
  }

  addQuantity() {
    if (this.quantity < this.max_quantity - this.product_cart_quantity) this.quantity++;
  }

  reduceQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(product_id: number, max: number) {
    this.product_cart_quantity = this.cart.products.find((product: any) => product.id == product_id)?.pivot.quantity || 0;
    if (max - this.product_cart_quantity == 0) return;

    this.shopService.addProductToCart({ 'product_id': product_id, 'quantity': this.quantity }).subscribe(
      (response) => {
        this.shopService.updateCart(response.data);
      })
  }


  buyNow(product_id: number) {
    this.product_cart_quantity = this.cart.products.find((product: any) => product.id == product_id)?.pivot.quantity || 0;
    if (this.max_quantity - this.product_cart_quantity == 0) return;

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
