import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './right-home.component.html',
  styleUrl: './right-home.component.css'
})
export class RightHomeComponent implements OnInit, AfterViewInit {
  user: any = [];
  friends: any = [];

  constructor(private el: ElementRef, private renderer: Renderer2, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    if (localStorage.getItem('auth_token')) {
      this.authService.getUser().subscribe(
        (response) => this.user = response);
    }

    this.authService.getFriend().subscribe(
      (response) => this.friends = response);

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
