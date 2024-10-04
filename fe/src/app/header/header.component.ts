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
  list: any;
  user: any;
  friends: any = [];
  keyword: string = '';

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    if (localStorage.getItem('auth_token')) {
      this.authService.getUser().subscribe(
        (response) => this.user = response);

      this.chatService.getList().subscribe(
        (data: any) => {
          this.list = data;
          console.log(this.list);
          
        });
    }
  }

  search(): void {
    if (this.keyword.trim()) {
      this.friends = this.list.filter((friend: any) =>
        friend.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
        friend.email.toLowerCase().includes(this.keyword.toLowerCase())
      );
      console.log(this.friends);
      
    }
    else {
      this.friends = [];
    }

  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => console.log(response)
    )
  }

  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout Success:', response);
        localStorage.removeItem('auth_token');
        location.reload();
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }
}
