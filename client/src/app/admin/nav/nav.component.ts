import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../service/chat.service';

@Component({
    selector: 'app-nav',
    imports: [RouterModule],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  constructor(
    private authService: AuthService, 
    private chatService: ChatService, 
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  logout(): void {
    // this.eventService.updateOnlineStatus('offline').subscribe(
    //   (response) => console.log(response)
    // )
    this.authService.logout().subscribe(
      (response) => {
        // console.log('Logout Success:', response);

        this.authService.removeAuthToken();
        this.chatService.removeConversation();

        this.router.navigate(['/landing-page']);
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }
}
