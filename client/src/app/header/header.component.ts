import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  listUser: any = [];;
  user: any;
  friends: any = [];
  keyword: string = '';

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    if (localStorage.getItem('auth_token')) {
      // this.authService.getUser().subscribe(
      //   (response) => {
      //     this.user = response;
      //     console.log(this.user);

      //   });

      this.authService.getListUser().subscribe(
        (response) => {
          this.listUser = response.data;
        });
    }
  }

  search(): void {

    if (this.keyword && !/^\s*$/.test(this.keyword)) {
      this.friends = this.listUser.filter((friend: any) =>
        friend.profile.display_name.toLowerCase().includes(this.keyword.trim().toLowerCase()) || friend.email.toLowerCase().includes(this.keyword.trim().toLowerCase())
      );
      // console.log(this.listUser);
    }
    else {
      this.friends = [];
    }
  }

  addFriend(receiver_id: number): void {
    console.log(receiver_id);
    
    this.authService.addFriend(receiver_id).subscribe(
      (response) => console.log(response)
    )
  }


}
