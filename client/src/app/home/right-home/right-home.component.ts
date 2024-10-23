import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { EventService } from '../../event.service';

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
        console.log(this.friends);

        this.friends.reverse();

        this.eventService.bindEvent('App\\Events\\FriendRequestEvent', (data: any) => {
          console.log('Friend request event:', data);
          if (data.status == "accepted") this.friends.unshift(data.sender);
        });

        this.friends_limit = this.friends.slice(0, 5);
      });

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
