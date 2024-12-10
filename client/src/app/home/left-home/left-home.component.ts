import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../service/event.service';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../service/chat.service';
import { CurrencyVNDPipe } from '../../currency-vnd.pipe';
import { SettingService } from '../../service/setting.service';
import { ShopService } from '../../service/shop.service';
import { CarouselService } from '../../service/carousel.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckoutService } from '../../service/checkout.service';
import { PaymentService } from '../../service/payment.service';

@Component({
  selector: 'app-left-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyVNDPipe, FormsModule, TranslateModule],
  templateUrl: './left-home.component.html',
  styleUrl: './left-home.component.css'
})
export class LeftHomeComponent implements OnInit, AfterViewInit {

  userRequest: any = [];
  groupRequest: any = [];
  user: any = [];
  listProduct: any = [];
  productDetail_id: number = 0;
  quantity: number = 1;
  content_feedback: string = '';
  feedbacks: any = [];
  cart: any = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private eventService: EventService,
    private chatService: ChatService,
    private settingService: SettingService,
    private shopService: ShopService,
    private carouselService: CarouselService,
    private router: Router,
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
  ) { }

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(response => this.user = response.data);

    this.authService.getRequestFriend().subscribe(
      (response) => {
        this.userRequest = response.data;

        this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
          // console.log('Friend request event:', data);

          if (data.status == "pending" && data.receiver.id == this.user.id && data.sender.id != this.user.id) this.userRequest.push(data);

          if (data.status == "accepted" || data.status == "canceled" || data.status == "rejected") {
            this.userRequest = this.userRequest.filter((request: any) => request.id !== data.id);
          }
        });

        this.eventService.bindEvent('App\\Events\\CancelFriendRequestEvent', (data: any) => {
          // console.log('Cancel friend request event:', data);

        });
      });

    this.chatService.getGroup().subscribe(
      (response) => {
        this.groupRequest = response.data;

        this.eventService.bindEvent('App\\Events\\ConversationInvitationEvent', (data: any) => {
          // console.log('Group request event:', data);

          if (data.status == "pending") this.groupRequest.push(data);

          if (data.status == "accepted") {
            this.groupRequest = this.groupRequest.filter((request: any) => request.id !== data.id);
          }
        });
      });

    this.shopService.getListProduct().subscribe(
      (response) => {
        this.listProduct = response.data.filter((product: any) => product.is_active == 1).slice(0, 4);
        // console.log(this.listProduct);
      });

    this.shopService.getCart().subscribe(data => this.cart = data.data);

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

  acceptRequest(id: number, status: string) {
    this.authService.acceptFriend({ id, status }).subscribe(
      (response) => {
        // console.log(response);
      });
  }

  acceptGroupRequest(id: number, status: string) {
    this.authService.acceptGroup({ id, status }).subscribe(
      (response) => {
        // console.log(response);
        if (status == 'accepted') this.router.navigate(['/chat']);
      });
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
}
