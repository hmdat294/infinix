import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { SettingService } from '../service/setting.service';
import { ShopService } from '../service/shop.service';
import { CarouselService } from '../service/carousel.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVNDPipe],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  listProduct: any = [];
  productDetail_id: number = 0;
  quantity: number = 1;
  content_feedback: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private settingService: SettingService,
    private carouselService: CarouselService,
    private shopService: ShopService,
  ) { }

  ngOnInit(): void {
    this.shopService.getListProduct().subscribe(
      (response) => {
        this.listProduct = response.data;
        console.log(this.listProduct);
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
}
