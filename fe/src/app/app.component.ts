import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  list: any;
  user: any;
  friends: any = [];
  keyword:string = '';

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    if (localStorage.getItem('auth_token')) {
      this.authService.getUser().subscribe(
        (response) => this.user = response);

      this.chatService.getList().subscribe(
        (data: any) => this.list = data.users);
    }
  }
  
  search(): void {
    if (this.keyword.trim()) {
      this.friends = this.list.filter((friend: any) =>
        friend.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
        friend.email.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
    else{
      this.friends = [];
    }

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
