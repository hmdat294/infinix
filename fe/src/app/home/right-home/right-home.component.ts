import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-right-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './right-home.component.html',
  styleUrl: './right-home.component.css'
})
export class RightHomeComponent implements OnInit {
  user: any;

  constructor(private el: ElementRef, private renderer: Renderer2, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    if (localStorage.getItem('auth_token')) {
      this.authService.getUser().subscribe(
        (response) => {
          this.user = response;
          console.log(this.user);
        });
    }

    this.accordion();

  }

  accordion() {
    const headers = this.el.nativeElement.querySelectorAll('.a-accordion-header') as NodeListOf<HTMLElement>;

    headers.forEach((header: HTMLElement) => {
      this.renderer.listen(header, 'click', () => {
        const panel = header.nextElementSibling as HTMLElement;

        header.classList.toggle('active');
        panel.classList.toggle('open');

        panel.style.maxHeight = (panel.classList.contains('open')) ? `${panel.scrollHeight}px` : '0px';
      });
    });
  }

  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout Success:', response);
        localStorage.removeItem('auth_token');
        this.router.navigate(['/']);
        location.reload();
      },
      (error) => {
        console.error('Logout Error:', error);
      }
    );
  }
}
