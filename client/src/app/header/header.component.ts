import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { debounceTime, filter, Subject } from 'rxjs';
import { EventService } from '../service/event.service';
import { ChatService } from '../service/chat.service';
import { MiniChatComponent } from '../mini-chat/mini-chat.component';
import { NotificationService } from '../service/notification.service';
import { CurrencyVNDPipe } from '../currency-vnd.pipe';
import { ShopService } from '../service/shop.service';
import { TranslateModule } from '@ngx-translate/core';
import { SettingService } from '../service/setting.service';

@Component({
    selector: 'app-header',
    imports: [RouterModule, CommonModule, FormsModule, MiniChatComponent, CurrencyVNDPipe, TranslateModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  friends: any = [];
  keyword: string = '';
  currentRoute: string | undefined;
  conversation: any[] = [];
  notificationChat: any = [];
  notification: any = [];
  notificationFilter: any = [];
  is_read_notification: string = 'all';
  cart: any;
  addQuantitySubject = new Subject<{ product_id: number, quantity: number }>();
  productChecked: any = [];
  groupedShops: any = [];
  total: number = 0;
  tabAccordion: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventService: EventService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private shopService: ShopService,
    private settingService: SettingService,
  ) { }

  ngOnInit(): void {

    this.currentRoute = this.router.url.split('/')[1];

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(
      (event: any) =>
        this.currentRoute = event.urlAfterRedirects.split('/')[1]
    );

    this.chatService.conversation$.subscribe(conversation => {
      // console.log('Updated conversation from localStorage:', conversation);
      this.conversation = conversation;
    });

    this.authService.getUser(0).subscribe(
      (res: any) => {
        this.eventService.bindEvent('App\\Events\\UserSendMessageEvent', (data: any) => {
          // console.log('Message event received:', data);

          if (this.conversation.includes(data.data.conversation_id))
            this.conversation = this.conversation.filter(id => id !== data.data.conversation_id);

          if (this.conversation.length >= 5)
            this.conversation.shift();

          this.conversation.push(data.data.conversation_id);
          this.chatService.updateConversation(this.conversation);

        });
      });

    this.notificationService.getNotification().subscribe(
      (data) => {

        this.notification = data.data.filter((item: any) => item.conversation_id == null);
        this.notificationChat = data.data.filter((item: any) => item.conversation_id != null);
        // console.log(this.notificationChat);

        this.notificationService.updateNotiChat(this.notificationChat);

        this.notificationFilter = [...this.notification];
        this.eventService.bindEvent('App\\Events\\NotificationEvent', (data: any) => {
          // console.log('Notification event received:', data);

          this.notificationService.updateNotiChat(this.notificationChat);

          this.notification.unshift(data.data.filter((item: any) => item.conversation_id == null));
          this.notificationChat.unshift(data.data.filter((item: any) => item.conversation_id != null));
          this.notificationFilter = [...this.notification];
        });

      });

    // this.notificationService.getNotification().subscribe(
    //   (data) => {
    //     this.notification = data.data.filter((item: any) => item.conversation_id == null);
    //     console.log(this.notification);
    //     this.notificationFilter = [...this.notification];
    //   });

    this.shopService.getCart().subscribe(
      (data) => {
        this.cart = data.data;
        // console.log(cart);
        this.groupShop();
      });

    this.shopService.cart$.subscribe(cart => {
      this.cart = cart;
      this.groupShop();
    });

    this.addQuantitySubject.pipe(debounceTime(1000)).subscribe(({ product_id, quantity }) => {
      this.shopService.updateProductToCart({ product_id, quantity }).subscribe(
        (response) => {
          console.log(response);
          this.shopService.updateCart(response.data);
        });
    });
  }

  noti_icon: any = {
    'user_like_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_thumb_like_20_filled"></i>',
    'user_comment_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_20_filled"></i>',
    'user_share_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_share_20_filled"></i>',
    'user_follow': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_person_heart_20_filled"></i>',
    'user_send_friend_request': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_person_add_20_filled"></i>',
    'user_accept_friend_request': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_person_available_20_filled"></i>',
    'user_send_conversation_invitation': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_add_20_filled"></i>',
    'user_accept_conversation_invitation': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_20_filled"></i>',
    'user_create_post': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_content_view_20_filled"></i>',
    'user_send_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_20_filled"></i>',
    'user_recall_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_dismiss_20_filled"></i>',
    'user_pin_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_pin_20_filled"></i>',
    'user_reply_message': '<i class="text-accent-default icon-size-20 icon icon-ic_fluent_chat_arrow_back_20_filled"></i>'
  }

  getCheckedProducts() {
    this.productChecked = this.cart?.products?.filter((item: any) => item.checked) || [];

    this.productChecked = this.productChecked?.reduce((acc: any[], product: any) => {
      let shops = acc.find((item) => item.shop_id === product.shop_id);

      if (!shops) {
        shops = {
          shop_id: product.shop_id,
          shop_name: product.shop_name,
          shop_logo: product.shop_logo,
          products: [],
        };
        acc.push(shops);
      }

      shops.products.push(product);

      return acc;
    }, []);

    this.getTotal();
  }

  payment() {
    const data = {
      'total': this.total,
      'shops': this.productChecked,
      'products_count': this.cart.products.length,
    }
    console.log(data);

    this.router.navigate(['/checkout', btoa(unescape(encodeURIComponent(JSON.stringify(data))))]);
    this.diaLogHeader = '';
  }

  removeToCart(shop_id: number, product_id: number) {
    this.shopService.removeProductToCart({ 'product_id': product_id }).subscribe(
      (data) => {
        console.log(data);

        const shop = this.groupedShops.find((shop: any) => shop.shop_id == shop_id);
        shop.products = shop.products.filter((product: any) => product.id != product_id);
        this.shopService.updateCart(data.data);

        if (shop.products.length == 0) this.groupedShops.splice(this.groupedShops.indexOf(shop), 1);
      });
  }

  addQuantity(shop_id: number, product_id: number) {
    const product = this.groupedShops.find((shop: any) => shop.shop_id == shop_id)
      .products.find((product: any) => product.id == product_id);
    product.pivot.quantity++;

    this.addQuantitySubject.next({ product_id: product_id, quantity: product.pivot.quantity });
    this.getTotal();
  }

  reduceQuantity(shop_id: number, product_id: number) {
    const product = this.groupedShops.find((shop: any) => shop.shop_id == shop_id)
      .products.find((product: any) => product.id == product_id);
    if (product.pivot.quantity > 1) {
      product.pivot.quantity--;

      this.addQuantitySubject.next({ product_id: product_id, quantity: product.pivot.quantity });
      this.getTotal();
    }
  }

  getTotal() {
    this.total = 0;
    this.productChecked.forEach((shop: any) =>
      shop.products.forEach((product: any) =>
        this.total +=
        (product.price - (product.price * (product.discount / 100))) * product.pivot.quantity
      )
    );
  }

  groupShop() {
    this.groupedShops = this.cart.products?.reduce((acc: any[], product: any) => {
      let shop = acc.find((item) => item.shop_id === product.shop_id);

      if (!shop) {
        shop = {
          shop_id: product.shop_id,
          shop_name: product.shop_name,
          shop_logo: product.shop_logo,
          products: [],
        };
        acc.push(shop);
      }

      shop.products.push(product);

      return acc;
    }, []);

    // console.log(this.groupedShops);
  }

  filterNotification(action: string) {
    this.is_read_notification = action;
    this.notification = (action == 'unread') ? this.notification.filter((noti: any) => noti.is_read == 1) : this.notificationFilter;
  }

  updateNotification(notification_id: number) {
    this.notificationService.updateNotification(notification_id).subscribe(
      (res: any) => {
        // console.log(res);
        this.notification.find((item: any) => item.id == notification_id).is_read = 1;
      });
  }

  deleteNotification(notification_id: number) {
    this.notificationService.deleteNotification(notification_id).subscribe(
      (res: any) => {
        // console.log(res);
        this.notification = this.notification.filter((item: any) => item.id != notification_id);
      });
  }

  clearSearch() {
    this.keyword = '';
    this.friends = [];
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        // console.log(response);
        this.clearSearch();
      });
  }

  gotoSearch(event: KeyboardEvent, keyword: string) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.router.navigate(['/search', keyword]);
    }
  }

  diaLogHeader: string = '';

  viewDiaLogHeader(action: string) {
    this.diaLogHeader = this.diaLogHeader == action ? '' : action;
  }

  tabChild(tab: string) {
    this.tabAccordion = this.tabAccordion == tab ? '' : tab;
    this.settingService.updateValue(tab);
  }

}
