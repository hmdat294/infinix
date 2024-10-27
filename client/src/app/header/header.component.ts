import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { filter } from 'rxjs';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  listUser: any = [];
  user: any;
  friends: any = [];
  keyword: string = '';
  currentRoute: string | undefined;

  conversation: any[] = [];
  message: any;

  constructor(private router: Router, private authService: AuthService, private eventService: EventService) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url.split('/')[1];
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(
      (event: any) => this.currentRoute = event.urlAfterRedirects.split('/')[1]
    );

    this.conversation = JSON.parse(localStorage.getItem('conversation') || '[]');

    // this.authService.getListUser().subscribe(
    //   (response) => {
    //     this.listUser = response.data;
    //   });

    // this.eventService.bindEvent('App\\Events\\UserSendMessageEvent', (data: any) => {
    //   console.log('Message received:', data);

    //   if (!this.conversation.includes(data.data.conversation_id)) {
    //     this.conversation.push(data.data.conversation_id);
    //     localStorage.setItem('conversation', JSON.stringify(this.conversation));
    //   }
    // });
  }

  // search(): void {
  //   if (this.keyword && !/^\s*$/.test(this.keyword)) {
  //     this.friends = this.listUser.filter((friend: any) =>
  //       friend.profile.display_name.toLowerCase().includes(this.keyword.trim().toLowerCase()) || friend.email.toLowerCase().includes(this.keyword.trim().toLowerCase())
  //     );
  //   }
  //   else {
  //     this.friends = [];
  //   }
  // }

  clearSearch() {
    this.keyword = '';
    this.friends = [];
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);
        this.clearSearch();
      });
  }

  gotoSearch(event: KeyboardEvent, keyword: string) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.router.navigate(['/search', keyword]);
    }
  }


}
