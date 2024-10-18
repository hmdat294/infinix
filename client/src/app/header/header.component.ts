import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  listUser: any = [];
  user: any;
  friends: any = [];
  keyword: string = '';
  currentRoute: string | undefined;

  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.authService.getListUser().subscribe(
      (response) => this.listUser = response.data);

    this.currentRoute = this.router.url.split('/').pop();

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)).subscribe(
        (event: any) => this.currentRoute = event.urlAfterRedirects.split('/').pop());

        console.log(this.currentRoute);
        
  }

  search(): void {
    if (this.keyword && !/^\s*$/.test(this.keyword)) {
      this.friends = this.listUser.filter((friend: any) =>
        friend.profile.display_name.toLowerCase().includes(this.keyword.trim().toLowerCase()) || friend.email.toLowerCase().includes(this.keyword.trim().toLowerCase())
      );
    }
    else {
      this.friends = [];
    }
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => console.log(response));
  }


}
