import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderDefaultComponent } from "./header-default/header-default.component";
import { HeaderAdminComponent } from "./admin/header-admin/header-admin.component";
import { AuthService } from './service/auth.service';
import { NavComponent } from "./admin/nav/nav.component";
import { filter } from 'rxjs';
import { EventService } from './service/event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, HeaderDefaultComponent, HeaderAdminComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  user: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private eventService: EventService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.renderer.setAttribute(document.documentElement, 'data-theme', localStorage.getItem('theme') || '');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.authService.token$.subscribe(auth_token => {
          this.isLoggedIn = !!auth_token;

          if (this.isLoggedIn) {
            this.authService.getUser(0).subscribe(
              (response) => {
                this.user = response.data;
              });
          }
        });
      }
    });

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(
      (event: any) =>
        this.isAdmin = !!(event.urlAfterRedirects.split('/')[1] == 'admin')
    );

  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:scroll')
  @HostListener('window:click')
  handleUserActivity() {
    if (this.isLoggedIn) {
      this.eventService.resetIdleTimer();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isLoggedIn) {
      navigator.sendBeacon('http://localhost:8000/api/update-online-status',
        JSON.stringify({ 'user_id': this.user?.id, online_status: 'offline' }));
    }
  }

}
