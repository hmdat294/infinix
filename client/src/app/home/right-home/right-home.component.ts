import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../service/event.service';

@Component({
  selector: 'app-right-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './right-home.component.html',
  styleUrl: './right-home.component.css'
})
export class RightHomeComponent implements OnInit, AfterViewInit {
  user: any = [];
  friends_limit: any = [];
  friends: any = [];
  showFriendMore: boolean = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('auth_token')) {
      this.authService.getUser(0).subscribe(
        (response) => this.user = response);
    }

    this.authService.getFriend().subscribe(
      (response) => {
        this.friends = response.data;
        // console.log(this.friends);

        this.friends.reverse();
        this.friends_limit = this.friends.slice(0, 5);

        this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
          console.log('Friend request event:', data);
          // nếu status là accepted thì data có sender và receiver, bản thân là 1 trong 2 thì thêm vào danh sách bạn bè người còn lại
          if (data.status == "accepted") {
            if (data.sender_id == this.user.id) {
              this.pushFriendList(data.receiver);
            }
            if (data.receiver_id == this.user.id) {
              this.pushFriendList(data.sender);
            }
          }
        });
      });

  }

  pushFriendList(data: any) {
    this.friends.unshift(data);
    this.friends_limit.unshift(data);
    this.friends_limit = this.friends.slice(0, 5);
  }

  ngAfterViewInit() {
    const accordion = this.el.nativeElement.querySelector('.a-accordion-header') as HTMLElement;
    const panel = this.el.nativeElement.querySelector('.accordion-panel') as HTMLElement;

    accordion.addEventListener('click', () => {

      accordion.classList.toggle('active');
      panel.classList.toggle('open');

      panel.style.maxHeight = (panel.classList.contains('open')) ? `${panel.scrollHeight}px` : '0px';
    });
  }

  friendMore() {
    this.showFriendMore = !this.showFriendMore;
  }

  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout Success:', response);
        localStorage.removeItem('auth_token');
        this.router.navigate(['/landing-page']);
        // location.reload();
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }
}
