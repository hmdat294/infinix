import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingService } from '../service/setting.service';
import { CarouselService } from '../service/carousel.service';
import { ShopService } from '../service/shop.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService } from '../service/chat.service';
import { CheckoutService } from '../service/checkout.service';
import { AuthService } from '../service/auth.service';
import { PaymentService } from '../service/payment.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, FormsModule, CurrencyVNDPipe, RouterModule, TranslateModule, NgxPaginationModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  listProduct: any = [];
  originalProducts: any[] = [];
  productDetail_id: number = 0;
  quantity: number = 1;
  content_feedback: string = '';
  tab_shop: string = 'tab_all';
  shop: any;
  currentUser: any;
  category_id: number = 0;
  conversation: any[] = [];
  feedbacks: any = [];
  cart: any = [];
  vouchers: any = [];
  currentPage = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private settingService: SettingService,
    private carouselService: CarouselService,
    private shopService: ShopService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.authService.getUser(0).subscribe(data => this.currentUser = data.data);

      this.shopService.getShop(params['shop_id']).subscribe(
        (res: any) => {
          this.shop = res.data;
          console.log(this.shop);
        })

      this.shopService.getListProductByShop(params['shop_id']).subscribe(
        (response) => {
          this.listProduct = response.data.filter((product: any) => product.is_active == 1);

          this.originalProducts = [...this.listProduct];
        });

      this.shopService.getVoucherByShop(params['shop_id']).subscribe((res) => {
        const currentDate = new Date();
        this.vouchers = res.data.filter((voucher: any) => {
          const validFrom = new Date(voucher.valid_from);
          const validUntil = new Date(voucher.valid_until);

          return (
            voucher.is_active === 1 &&
            voucher.stock > 0 &&
            currentDate >= validFrom &&
            currentDate <= validUntil
          );
        }).slice(0, 3);

        console.log(this.vouchers);

      });
    });

    this.chatService.conversation$.subscribe(conversation => {
      // console.log('Updated conversation from localStorage:', conversation);
      this.conversation = conversation;
    });

    this.shopService.getCart().subscribe(
      (data) => this.cart = data.data);

    this.shopService.cart$.subscribe(cart => {
      this.cart = cart;

      if (this.productDetail_id > 0)
        this.product_cart_quantity = this.cart.products.find((product: any) => product.id == this.productDetail_id)?.pivot.quantity || 0;

    });

  }

  calculateDays(end_date: Date) {
    const today = new Date();
    const targetDate = new Date(end_date);
    return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  getVoucherDescription(
    discount: string,
    apply_to_products: string,
    min_price: string,
    max_discount: string) {

    return this.translate.instant('shop.voucher_description', {
      discount: discount,
      apply_to_products: apply_to_products,
      min_price: min_price,
      max_discount: max_discount,
    });
  }

  saveVoucher(code: string) {
    this.shopService.saveVoucher(code).subscribe(
      (res) => {
        console.log(res);
        const voucher = this.vouchers.find((item: any) => item.code == code);
        voucher.is_saved = !voucher.is_saved;
      });
  }

  sortProductByCategory() {
    if (this.category_id > 0) {
      this.listProduct = this.originalProducts.filter(
        (product: any) => product.category_id == this.category_id
      );
    } else this.listProduct = [...this.originalProducts];
  }

  createChat(receiver_id: number) {
    this.chatService.getMessageUser(receiver_id).subscribe(
      (response: any) => {

        if (this.conversation.includes(response.data.id))
          this.conversation = this.conversation.filter(id => id !== response.data.id);

        if (this.conversation.length >= 5) this.conversation.shift();

        this.conversation.push(response.data.id);

        this.chatService.updateConversation(this.conversation);
        this.chatService.tagOpenBoxChat = true;
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

  resizeTextarea(event: any): void {
    const textarea = event.target;
    if (!textarea.value) {
      textarea.style.height = '32px'; // Chiều cao mặc định khi không có nội dung
    } else if (textarea.scrollHeight < 110) {
      textarea.style.height = 'fit-content';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  tabShop(tab: string) {
    this.tab_shop = this.tab_shop === tab ? '' : tab;

    if (tab == 'tab_best_seller')
      this.listProduct.sort((a: any, b: any) => Number(b.total_sold) - Number(a.total_sold));
    else if (tab == 'tab_discount')
      this.listProduct.sort((a: any, b: any) => Number(b.discount) - Number(a.discount));
    else if (tab == 'tab_reduction')
      this.listProduct.sort((a: any, b: any) => Number(b.price - ((b.price * b.discount) / 100)) - Number(a.price - ((a.price * a.discount) / 100)));
    else if (tab == 'tab_increase')
      this.listProduct.sort((a: any, b: any) => Number(a.price - ((a.price * a.discount) / 100)) - Number(b.price - ((b.price * b.discount) / 100)));
    else
      this.listProduct = [...this.originalProducts];
  }
}
