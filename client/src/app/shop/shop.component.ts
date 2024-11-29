import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingService } from '../service/setting.service';
import { CarouselService } from '../service/carousel.service';
import { ShopService } from '../service/shop.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVNDPipe, RouterModule],
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
  sort_by_id: number = 0;
  conversation: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private settingService: SettingService,
    private carouselService: CarouselService,
    private shopService: ShopService,
    private chatService: ChatService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.shopService.getShop(params['shop_id']).subscribe(
        (res: any) => {
          this.shop = res.data;
          console.log(this.shop);

        })

      this.shopService.getListProductByShop(params['shop_id']).subscribe(
        (response) => {
          this.listProduct = response.data.filter((product:any) => product.is_active == 1);
          console.log(this.listProduct);

          this.originalProducts = [...this.listProduct];
        });

    });

    this.chatService.conversation$.subscribe(conversation => {
      // console.log('Updated conversation from localStorage:', conversation);
      this.conversation = conversation;
    });

  }

  sortProduct() {
    if (this.sort_by_id > 0) {
      this.listProduct = this.originalProducts.filter(
        (product: any) => product.category_id == this.sort_by_id
      );
    } else this.listProduct = [...this.originalProducts];
  }


  createChat(receiver_id: number) {
    this.chatService.getMessageUser(receiver_id).subscribe(
      (response: any) => {
        // console.log(response);

        if (this.conversation.includes(response.data.id)) {
          this.conversation = this.conversation.filter(id => id !== response.data.id);
        }

        if (this.conversation.length >= 5) {
          this.conversation.shift();
        }

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
  }
}
